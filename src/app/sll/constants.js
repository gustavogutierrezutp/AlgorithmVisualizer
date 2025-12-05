/**
 * Constants for Single Linked List Visualizer
 * Centralized configuration for layout, colors, animations, and styling
 */

// Layout and positioning
export const LAYOUT = {
  NODE_HORIZONTAL_SPACING: 150,    // Distance between adjacent nodes
  POINTER_VERTICAL_OFFSET: 100,    // Distance between pointer and node
  INITIAL_X: 50,                   // Starting X position for first node
  INITIAL_Y: 100,                  // Y position for list nodes
  FIT_VIEW_PADDING: 0.3,           // Default padding for fit view
  FIT_VIEW_PADDING_LARGE: 0.5,     // Larger padding for empty list
};

// Default colors
export const COLORS = {
  NODE_DEFAULT: '#2196F3',         // Blue - standard node color
  NODE_NEW: '#4CAF50',             // Green - newly inserted node
  NODE_ITERATE: '#FF5722',         // Orange - node being traversed
  HEAD_HIGHLIGHT: '#9C27B0',       // Purple - head node highlight
  TAIL_HIGHLIGHT: '#E91E63',       // Pink - tail node highlight
  HEAD_BORDER: '#7B1FA2',          // Dark purple - head border
  TAIL_BORDER: '#C2185B',          // Dark pink - tail border
  EDGE_DEFAULT: '#333',            // Dark gray - standard edge color
  POINTER_HOVER: '#F44336',        // Red - pointer hover state
};

// Edge styling
export const EDGE_STYLE = {
  STROKE_WIDTH_DEFAULT: 2,         // Standard edge thickness
  STROKE_WIDTH_HIGHLIGHTED: 4,     // Highlighted edge thickness
  STROKE_WIDTH_REVERSE: 3,         // Reverse operation edge thickness
  MARKER_WIDTH: 10,                // Arrow marker width
  MARKER_HEIGHT: 10,               // Arrow marker height
};

// Animation
export const ANIMATION = {
  DEFAULT_SPEED: 500,              // Default animation speed in ms
  SPEED_MIN: 10,                   // Minimum speed (fastest)
  SPEED_MAX: 1000,                 // Maximum speed (slowest)
  FIT_VIEW_DURATION: 500,          // Duration for fitView animation
  FIT_VIEW_DELAY: 100,             // Delay before fitView
};

// Initial state
export const INITIAL_STATE = {
  COUNT: 5,                        // Default number of nodes
};

// Node styling (for createInitialList and createListFromSequence)
export const NODE_STYLE = {
  BORDER: '2px solid #333',
  BORDER_RADIUS: '8px',
  PADDING: '10px',
  FONT_SIZE: '16px',
  COLOR: 'white',
  FONT_WEIGHT: 'bold',
  BORDER_HIGHLIGHTED: '3px solid #E64A19',  // For operations like reverse
};

// Scramble randomization ranges
export const SCRAMBLE = {
  X_RANGE: 800,
  X_OFFSET: 50,
  Y_RANGE: 400,
  Y_OFFSET: 50,
};

// Circular node randomization ranges
export const CIRCULAR_NODE = {
  X_RANGE: 400,
  X_OFFSET: 50,
  Y_RANGE: 400,
  Y_OFFSET: 50,
};

// Export PNG settings
export const EXPORT = {
  BACKGROUND_COLOR: '#f9fafb',
  VIEWPORT_MIN_SCALE: 0.5,
  VIEWPORT_MAX_SCALE: 2,
  VIEWPORT_PADDING: 0.1,
  EXTRA_PADDING: 100,
};

// Laser pointer
export const LASER_POINTER = {
  SIZE: 20,                        // Diameter of laser pointer dot
  COLOR: 'rgba(255, 0, 0, 0.7)',   // Red with transparency
  GLOW_COLOR: 'rgba(255, 0, 0, 0.5)',
  GLOW_SIZE: '0 0 20px 5px',
};

// Node IDs
export const NODE_IDS = {
  POINTER_HEAD: 'pointer-head',
  POINTER_TAIL: 'pointer-tail',
};

// Operation indices (for handleVisualize switch statement)
export const OPERATIONS = {
  INSERT_HEAD: 0,
  DELETE_HEAD: 1,
  INSERT_TAIL: 2,
  DELETE_TAIL: 3,
  TRAVERSE: 4,
  REVERSE: 5,
  INSERT_TAIL_O1: 6,
  INSERT_AT_POSITION: 7,
  GET_LENGTH: 8,
  SEARCH_VALUE: 9,
  FIND_MIDDLE: 10,
  DELETE_AT_POSITION: 11,
};
