import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome6, Feather, Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/themes.js";
import { wp, hp } from "../../helpers/common.js";
import Categories from "../../components/categories.js";
import { apiCall } from "../../api/index.js";
import ImageGrid from "../../components/ImageGrid.js";
import { debounce, filter } from "lodash";
import FiltersModal from "../../components/filtersModal.js";
import { useRouter } from "expo-router";

var page = 1;
const HomeScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const searchInputRef = useRef(null);
  const modelRef = useRef(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    console.log("Params: ", params, append);
    let result = await apiCall(params);
    //console.log("Result :", result.data?.hits[0]);
    if (result.succcess && result?.data?.hits) {
      if (append) {
        setImages([...images, ...result.data.hits]);
      } else {
        setImages([...result.data.hits]);
      }
    }
  };
  //console.log("Images: ", images);

  const applyFilters = () => {
    //console.log("Applying Filters: ", filters);
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params);
    }
    closeFiltersModal();
  };

  const resetFilters = () => {
    //console.log("Resetting Filters: ", filter);
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };
      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params);
    }

    closeFiltersModal();
  };

  const clearThisFilter = (filterName) => {
    let filterz = { ...filters };
    delete filterz[filterName];
    setFilters({ ...filterz });
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params);
  };

  const handleChangeCategory = (category) => {
    setActiveCategory(category);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (category) params.category = category;
    fetchImages(params, false);
  };

  //console.log("Active Category: ", activeCategory);

  const handleSearch = (text) => {
    //console.log("Searching for...", text);
    setSearch(text);
    if (text.length > 2) {
      // Search for text
      page = 1;
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, q: text, ...filters }, false);
    }
    if (text == "") {
      // Reset search results
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null);
      fetchImages({ page, ...filters }, false);
    }
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  const openFiltersModal = () => {
    modelRef?.current?.present();
  };

  const closeFiltersModal = () => {
    modelRef?.current?.close();
  };

  //console.log("Filters: ", filters);

  const handleScroll = (event) => {
    //console.log("You Scrolled!");
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomePosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomePosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log("You Reached at End");
        ++page;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={theme.colors.neutral(0.7)}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>

          <TextInput
            //value={search}
            onChangeText={handleTextDebounce}
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search for photos..."
          />
          {search && (
            <TouchableOpacity
              onPress={() => handleSearch("")}
              style={styles.closeIcon}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
        {/* Categories */}
        <View>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>
        {/* Filters */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key === "colors" ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      />
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}

                    <TouchableOpacity
                      style={styles.filterCloseIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
        {/* Images Masonry Grid */}
        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>
        {/* Loader */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator />
        </View>
      </ScrollView>
      <FiltersModal
        modelRef={modelRef}
        filters={filters}
        setFilters={setFilters}
        onApply={applyFilters}
        onClose={closeFiltersModal}
        onReset={resetFilters}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    flexDirection: "row",
    borderRadius: theme.radius.sm,
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});
