import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

export type RootStackParamList = {
  Tabs: undefined;
  ActivityDetail: { activityId: string };
  Legal: undefined;
  Auth: undefined;
  WelcomeUsername: undefined;
  ResetPassword: undefined;
  CreateActivity: undefined;
};

export type TabParamList = {
  Explore: undefined;
  Map: undefined;
  Lore: undefined;
  Profile: undefined;
};

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  MaterialTopTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
