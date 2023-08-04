function generatePlanes(level) {
  //const shipSizes = [4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1]; // Sizes of the ships
  let shipSizes;
  let ships_of_one = '0';
  switch (level) {
    case 'Easy':
      shipSizes = [5, 5, 4, 3];
      break;
    case 'Medium':
      shipSizes = [4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1];
      ships_of_one = '6';
      break;
    case 'Hard':
      shipSizes = [1, 1, 1, 1, 1, 1, 1];
      ships_of_one = '7';
      break;
  }

  const boardSize = 10; // Size of the game board
  const ships = [];

  // Function to generate a random ship position and orientation
  function generateShipPosition(size) {
    const ship = {
      size: size,
      positions: [],
    };

    const isHorizontal = Math.random() < 0.5;
    let row, col;

    if (isHorizontal) {
      // Generate starting row and column for a horizontal ship
      row = Math.floor(Math.random() * boardSize);
      col = Math.floor(Math.random() * (boardSize - size + 1));
    } else {
      // Generate starting row and column for a vertical ship
      row = Math.floor(Math.random() * (boardSize - size + 1));
      col = Math.floor(Math.random() * boardSize);
    }

    // Generate ship positions based on the starting row and column
    for (let i = 0; i < size; i++) {
      if (isHorizontal) {
        ship.positions.push({ row: row, col: col + i });
      } else {
        ship.positions.push({ row: row + i, col: col });
      }
    }

    return ship;
  }

  const map = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
    8: 'i',
    9: 'j',
  };

  // Generate ships of different sizes
  for (let size of shipSizes) {
    let ship;
    do {
      ship = generateShipPosition(size);
    } while (
      ships.some((existingShip) => isColliding(existingShip, ship)) ||
      (size === 1 && isNextToOneSquareShip(ship, ships))
    );

    ships.push(ship);
  }

  let final_ships = [];
  let group_ships = [];
  for (const ship of ships) {
    let tmp_ship = [];

    for (const position of ship.positions) {
      const element = `${map[`${position.col}`]}_${position.row + 1}`;

      tmp_ship.push(element);
      final_ships.push(element);
    }

    group_ships.push(tmp_ship);
  }

  final_ships.push(ships_of_one);

  return { planes: final_ships, group_planes: group_ships };
}

function isColliding(ship1, ship2) {
  for (let pos1 of ship1.positions) {
    for (let pos2 of ship2.positions) {
      if (pos1.row === pos2.row && pos1.col === pos2.col) {
        return true;
      }
    }
  }
  return false;
}

function isNextToOneSquareShip(ship, ships) {
  const offsets = [
    { row: -1, col: -1 },
    { row: -1, col: 0 },
    { row: -1, col: 1 },
    { row: 0, col: -1 },
    { row: 0, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ];

  for (let pos of ship.positions) {
    for (let offset of offsets) {
      const newRow = pos.row + offset.row;
      const newCol = pos.col + offset.col;
      for (let existingShip of ships) {
        for (let existingPos of existingShip.positions) {
          if (
            existingShip.size === 1 &&
            existingPos.row === newRow &&
            existingPos.col === newCol
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

module.exports = {
  generatePlanes,
};
