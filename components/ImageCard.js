import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize, hp, wp } from "../helpers/common";
import { theme } from "../constants/themes";

const ImageCard = ({ item, index, columns, router }) => {
  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  };
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };
  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "home/image", params: { ...item } })
      }
      style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}
    >
      <Image
        source={{ uri: item?.webformatURL }}
        style={[styles.image, getImageHeight()]}
        transition={100}
      />
    </TouchableOpacity>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: hp(2),
  },
  spacing: { marginRight: wp(2) },
  image: {
    width: "100%",
    height: 300,
  },
});
