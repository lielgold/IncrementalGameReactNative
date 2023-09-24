import React, { Component } from 'react';
import { StyleSheet, View, Text, Pressable  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IncrementalGameState {
  gold: number;
  building1: number;
  building2: number;
  building3: number;
}

class IncrementalGame extends Component<{}, IncrementalGameState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      gold: 0,
      building1: 0,
      building2: 0,
      building3: 0,
    };
  }

  async componentDidMount() {
    await this.loadGameData();
  }

  componentWillUnmount() {
    this.saveGameData();
  }

  saveGameData = async () => {
    try {
      await AsyncStorage.setItem('gameData', JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  loadGameData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('gameData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        this.setState(parsedData);
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    }
  };

  // add gold that equals to 1 + how_much_to_add * number of buildings 
  addGold = (how_much_gold_to_add = 1) => {
    this.setState((prevState) => ({
      gold:
        prevState.gold +
        1 +
        how_much_gold_to_add *
          (1 * prevState.building1 + 2 * prevState.building2 + 3 * prevState.building3),
    }));
  };

  handleButtonClick = () => {
    this.setState((prevState) => ({ gold: prevState.gold + 1 }));
  };

  buyBuilding = async (buildingType: string, cost: number, increment: number) => {
    if (this.state.gold >= cost) {
      // Create a new object with the updated property
      const updatedBuilding = {
        ...this.state,
        [buildingType]: this.state[buildingType] + 1,
        gold: this.state.gold - cost,
      };
  
      // Update the state with the new object
      this.setState(updatedBuilding, () => this.saveGameData());
    }
  };

  winGame = async () => {
    // Check if the player has enough resources to win the game
    if (this.state.gold >= 1000) {
      alert('Congratulations! You won the game!');
    } else {
      alert('Not enough gold to win the game.');
    }
  };

  render() {
    return (
      <View>
        <Text>
          Gold: {this.state.gold}, GPS:{' '}
          {1 +
            this.state.building1 * 1 +
            this.state.building2 * 2 +
            this.state.building3 * 3}
        </Text>
        <Pressable
          onPress={() => this.addGold()}
          style={[styles.button, { backgroundColor: 'blue' }]}
        >
          <Text style={styles.white_text}>Click for Gold</Text>
        </Pressable>
        <View>

          <Pressable
            onPress={() => this.buyBuilding('building1', 10, 1)}
            style={[
              styles.button,
              this.state.gold < 10 ? styles.disabled_button : { backgroundColor: 'blue' },
            ]}
            disabled={this.state.gold < 10}
          >
            <Text
              style={[
                styles.white_text,        
              ]}
            >
              {`Buy Building 1 (Cost: 10 Gold) (${this.state.building1})`}
            </Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            onPress={() => this.buyBuilding('building2', 50, 5)}
            style={[
              styles.button,
              this.state.gold < 50 ? styles.disabled_button : {},
            ]}
            disabled={this.state.gold < 50}
          >
            <Text
              style={[
                styles.white_text,        
              ]}
            >
              {`Buy Building 2 (Cost: 50 Gold) (${this.state.building2})`}
            </Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            onPress={() => this.buyBuilding('building3', 100, 10)}
            style={[
              styles.button,
              this.state.gold < 100 ? styles.disabled_button : {},
            ]}
            disabled={this.state.gold < 100}
          >
            <Text
              style={[
                styles.white_text,        
              ]}
            >
              {`Buy Building 3 (Cost: 100 Gold) (${this.state.building3})`}
            </Text>
          </Pressable>
        </View>
        <View>
          <Pressable
            onPress={this.winGame}
            style={[
              styles.button,
              this.state.gold < 1000 ? styles.disabled_button : {},
            ]}
            disabled={this.state.gold < 1000}
          >
            <Text
              style={[
                styles.white_text,
                this.state.gold < 1000 ? styles.disabled_button : {},
              ]}
            >
              {`Win the Game (Cost: 1000 Gold)`}
            </Text>
          </Pressable>
        </View>

      </View>
    );
  }
}

export default IncrementalGame;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'blue',
  },
  disabled_button: {
    backgroundColor: 'grey',
  },  
  white_text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  }, 
  
});