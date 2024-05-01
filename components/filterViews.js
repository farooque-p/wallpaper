import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../constants/themes";
import { capitalize, hp } from "../helpers/common";

export const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFiltersRow = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
          let color = isActive ? "white" : theme.colors.neutral(0.7);

          return (
            <TouchableOpacity
              onPress={() => onSelect(item)}
              key={index}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {capitalize(item)}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export const ColorFilter = ({ data, filterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [filterName]: item });
  };
  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[filterName] == item;
          let borderColor = isActive ? theme.colors.neutral(0.3) : "white";

          return (
            <TouchableOpacity onPress={() => onSelect(item)} key={index}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]} />
              </View>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  title: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },
  outlinedButtonText: {},
  colorWrapper: {
    padding: 3,
    borderRadius: theme.radius.sm,
    borderWidth: 2,
    borderCurve: "continuous",
  },
  color: {
    width: 40,
    height: 30,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
});
