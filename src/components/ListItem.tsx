import React from 'react';
import { View, ViewProps } from 'react-native';

interface ListItemProps extends ViewProps {
  children: React.ReactNode;
  isLast?: boolean;
  dividerColor?: string;
  padding?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  children,
  isLast = false,
  dividerColor = 'gray-700',
  padding = 'py-3 px-4',
  className,
  ...props
}) => {
  const dividerClass = isLast ? '' : `border-b border-${dividerColor}`;
  const combinedClassName = `w-full ${dividerClass} ${padding} ${className || ''}`.trim();

  return (
    <View className={combinedClassName} {...props}>
      {children}
    </View>
  );
};