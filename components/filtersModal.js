import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "../helpers/common";
import { theme } from "../constants/themes";
import { ColorFilter, CommonFiltersRow, SectionView } from "./filterViews";
import { data } from "../constants/data";
import { stubTrue } from "lodash";

const FiltersModal = ({
  modelRef,
  onClose,
  onApply,
  filters,
  setFilters,
  onReset,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);
  return (
    <BottomSheetModal
      ref={modelRef}
      index={0}
      snapPoints={snapPoints}
      //onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = capitalize(sectionName);
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
                key={sectionName}
              >
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}
          {/* Actions */}
          <Animated.View
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={[styles.buttons]}
          >
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  order: (props) => <CommonFiltersRow {...props} />,
  orientation: (props) => <CommonFiltersRow {...props} />,
  type: (props) => <CommonFiltersRow {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const CustomBackdrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });
  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];
  return (
    <Animated.View style={containerStyle}>
      <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
};

export default FiltersModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    //width: "100%",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 15,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
    borderColor: theme.colors.grayBG,
  },
  buttonText: {
    fontSize: hp(2.4),
  },
});
