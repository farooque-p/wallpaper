import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { hp, wp } from "../../helpers/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { theme } from "../../constants/themes";
import { Octicons, Entypo } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState("loading");
  //console.log("Image Data: ", item);

  const uri = item?.webformatURL;
  const fileName = item?.previewURL.split("/").pop();
  const imageUrl = uri;

  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  //console.log("File Path: ", filePath);

  const onLoad = () => {
    setStatus("");
  };

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS == "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      // Image is portrait
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const handleDownloadImage = async () => {
    setStatus("downloading");
    let uri = await downloadFile();
    if (uri) showToast("Image Downloaded!");
  };

  const handleShareImage = async () => {
    setStatus("sharing");
    let uri = await downloadFile();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      setStatus("");
      //console.log("Downloaded At: ", uri);
      return uri;
    } catch (error) {
      console.log(error);
      setStatus("");
      Alert.alert("Image Download", error.message);
      return null;
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: "success",
      text1: "Wallpaper",
      text2: message,
      position: "bottom",
    });
  };

  const toastConfig = {
    success: ({ text2, props, ...rest }) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{text2}</Text>
      </View>
    ),
  };

  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      <View style={getSize()}>
        <View style={styles.loading}>
          {status == "loading" && (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <Image
          transition={100}
          style={[styles.image, getSize()]}
          source={uri}
          onLoad={onLoad}
        />
      </View>
      {/* Action Buttons */}
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status == "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleDownloadImage}
            >
              <Octicons name="download" size={24} color="white" />
            </TouchableOpacity>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status == "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" size={24} color="white" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: 40,
    flexDirection: "row",
    gap: 50,
    alignItems: "center",
  },
  button: {
    width: hp(6),
    height: hp(6),
    backgroundColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
  },
});
