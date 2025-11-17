# NativeWind API Reference

Complete reference for NativeWind v4 utility classes in React Native.

## Layout & Flexbox

### Display
```tsx
className="flex hidden"
```

### Flex Direction
```tsx
className="flex-row flex-col flex-row-reverse flex-col-reverse"
```

### Flex Wrap
```tsx
className="flex-wrap flex-nowrap flex-wrap-reverse"
```

### Flex Properties
```tsx
className="flex-1 flex-auto flex-initial flex-none"
```

### Justify Content
```tsx
className="justify-start justify-end justify-center justify-between justify-around justify-evenly"
```

### Align Items
```tsx
className="items-start items-end items-center items-baseline items-stretch"
```

### Align Self
```tsx
className="self-auto self-start self-end self-center self-stretch"
```

### Align Content
```tsx
className="content-start content-end content-center content-between content-around content-stretch"
```

## Spacing

### Padding
```tsx
className="p-0 p-1 p-2 p-3 p-4 p-5 p-6 p-8 p-10 p-12 p-16 p-20 p-24"
className="px-4 py-2" // horizontal, vertical
className="pt-4 pr-2 pb-4 pl-2" // individual sides
```

### Margin
```tsx
className="m-0 m-1 m-2 m-3 m-4 m-5 m-6 m-8 m-10 m-12 m-16 m-20 m-24"
className="mx-auto my-4" // horizontal, vertical, auto centering
className="mt-4 mr-2 mb-4 ml-2" // individual sides
className="-m-4 -mt-2" // negative margins
```

### Gap
```tsx
className="gap-0 gap-1 gap-2 gap-3 gap-4 gap-6 gap-8"
className="gap-x-4 gap-y-2" // row/column gap
```

## Sizing

### Width
```tsx
className="w-full w-screen w-1/2 w-1/3 w-1/4"
className="w-0 w-1 w-2 w-4 w-8 w-16 w-32 w-64"
className="w-auto w-fit w-min w-max"
className="min-w-0 min-w-full max-w-xs max-w-sm max-w-md max-w-lg"
```

### Height
```tsx
className="h-full h-screen h-1/2 h-1/3 h-1/4"
className="h-0 h-1 h-2 h-4 h-8 h-16 h-32 h-64"
className="h-auto h-fit h-min h-max"
className="min-h-0 min-h-full min-h-screen max-h-full max-h-screen"
```

## Typography

### Font Size
```tsx
className="text-xs text-sm text-base text-lg text-xl text-2xl text-3xl text-4xl text-5xl"
```

### Font Weight
```tsx
className="font-thin font-light font-normal font-medium font-semibold font-bold font-extrabold"
```

### Text Alignment
```tsx
className="text-left text-center text-right text-justify"
```

### Text Color
```tsx
className="text-black text-white text-gray-500 text-blue-500 text-red-500"
className="text-gray-50 text-gray-100 ... text-gray-900" // shades 50-900
```

### Text Transform
```tsx
className="uppercase lowercase capitalize normal-case"
```

### Line Height
```tsx
className="leading-none leading-tight leading-normal leading-relaxed leading-loose"
className="leading-3 leading-4 leading-5 leading-6 leading-7 leading-8 leading-9 leading-10"
```

### Letter Spacing
```tsx
className="tracking-tighter tracking-tight tracking-normal tracking-wide tracking-wider tracking-widest"
```

### Text Decoration
```tsx
className="underline line-through no-underline"
```

## Colors & Backgrounds

### Background Color
```tsx
className="bg-transparent bg-white bg-black"
className="bg-gray-50 bg-gray-100 ... bg-gray-900"
className="bg-red-500 bg-blue-500 bg-green-500" // all color shades
```

### Opacity
```tsx
className="opacity-0 opacity-25 opacity-50 opacity-75 opacity-100"
```

## Borders

### Border Width
```tsx
className="border border-0 border-2 border-4 border-8"
className="border-t border-r border-b border-l" // individual sides
className="border-x-2 border-y-2" // horizontal/vertical
```

### Border Color
```tsx
className="border-gray-200 border-blue-500 border-transparent"
```

### Border Radius
```tsx
className="rounded rounded-none rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl"
className="rounded-full" // circle
className="rounded-t-lg rounded-r-lg rounded-b-lg rounded-l-lg" // individual corners
className="rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-lg"
```

## Shadows

```tsx
className="shadow shadow-sm shadow-md shadow-lg shadow-xl shadow-2xl"
className="shadow-none"
```

## Position

### Position Type
```tsx
className="static relative absolute fixed"
```

### Positioning
```tsx
className="top-0 right-0 bottom-0 left-0"
className="top-1 top-2 top-4 top-8 top-16"
className="inset-0 inset-x-0 inset-y-0" // all sides
```

### Z-Index
```tsx
className="z-0 z-10 z-20 z-30 z-40 z-50"
className="z-auto"
```

## Overflow

```tsx
className="overflow-visible overflow-hidden overflow-scroll"
className="overflow-x-auto overflow-y-auto"
```

## Dark Mode

Apply styles based on system theme:

```tsx
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-white"
className="border-gray-200 dark:border-gray-700"
```

## Responsive Design

Apply styles at specific breakpoints:

```tsx
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px
className="w-full md:w-1/2 lg:w-1/3"
className="text-base sm:text-lg md:text-xl lg:text-2xl"
className="flex-col md:flex-row"
className="p-2 sm:p-4 md:p-6 lg:p-8"
```

## Platform-Specific Styles

NativeWind v4 supports platform modifiers:

```tsx
className="ios:pt-12 android:pt-4" // Platform-specific
className="web:cursor-pointer" // Web-only styles
```

## State Modifiers

Handle interactive states:

```tsx
// Note: These work with Pressable component
<Pressable className="bg-blue-500 active:bg-blue-600">
  <Text className="text-white">Press Me</Text>
</Pressable>
```

## Custom Values

Use arbitrary values when needed:

```tsx
className="w-[250px] h-[100px]"
className="text-[#1a1a1a] bg-[#f0f0f0]"
className="p-[15px] m-[20px]"
className="rounded-[25px]"
```

## Combining Classes

```tsx
<View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 p-4">
  <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
    Hello World
  </Text>
  <View className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg">
    {/* Content */}
  </View>
</View>
```

## Common Utility Combinations

### Card Component
```tsx
className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700"
```

### Button
```tsx
className="bg-blue-500 active:bg-blue-600 px-6 py-3 rounded-lg"
```

### Input
```tsx
className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base"
```

### Container
```tsx
className="flex-1 bg-white dark:bg-gray-900 px-4 py-6"
```

### List Item
```tsx
className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700"
```

## Performance Tips

1. Prefer direct className values over dynamic interpolation
2. Use platform-specific styles only when necessary
3. Combine related utilities for better readability
4. Leverage dark mode modifiers instead of manual theme switching
5. Use responsive modifiers sparingly on mobile-first designs
