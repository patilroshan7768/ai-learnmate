import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import DashboardScreen from "../screens/DashboardScreen";
import UploadScreen from "../screens/UploadScreen";
import TranscriptScreen from "../screens/TranscriptScreen";
import QuizScreen from "../screens/QuizScreen";
import RecommendationsScreen from "../screens/RecommendationsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddCourseScreen from "../screens/AddCourseScreen";
import AddLessonScreen from "../screens/AddLessonScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import LessonPlayerScreen from "../screens/LessonPlayerScreen";
import EditCourseScreen from "../screens/EditCourseScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const DashboardStackNav = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="AddLesson" component={AddLessonScreen} />
      <Stack.Screen name="LessonPlayer" component={LessonPlayerScreen}/>
      <Stack.Screen name="EditCourse" component={EditCourseScreen} />
    </Stack.Navigator>
  );
}

function AIStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Upload" component={UploadScreen} />
      <Stack.Screen name="Transcript" component={TranscriptScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
    </Stack.Navigator>
  );
}

function TabIcon({ name, color }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Ionicons name={name} size={22} color={color} />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#6C63FF",
          shadowOpacity: 0.1,
          shadowRadius: 20,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute"
        },
        tabBarActiveTintColor: "#6C63FF",
        tabBarInactiveTintColor: "#8E8EA0",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="AI Tools"
        component={AIStack}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "mic" : "mic-outline"} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{
          tabBarLabel: "For You",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "bulb" : "bulb-outline"} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}
