import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const Icon = ({ name, size = 24, color = 'currentColor' }) => {
  return <MaterialIcons name={name} size={size} color={color} />;
};

export default Icon;