import React, {useRef, useState} from 'react';
import {Text, SafeAreaView, StyleSheet, ImageBackground} from "react-native";

import Carousel, {Pagination} from "react-native-snap-carousel";
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from "../container/CarouselCardItem";
import tips from "../config/tips";
import Colors from "../config/colors";

const TipsScreen = () => {
    const isCarousel = useRef(null);
    const [index, setIndex] = useState(0);

    return (
        <ImageBackground source={require('../assets/ImageBackground.png')}
                         style={styles.containerImage}
                         imageStyle={styles.image}>
        <SafeAreaView style={styles.container}>
            <Carousel data={tips}
                      renderItem={CarouselCardItem}
                      layout="stack"
                      layoutCardOffset={9}
                      ref={isCarousel}
                      sliderWidth={SLIDER_WIDTH}
                      itemWidth={ITEM_WIDTH}
                      inactiveSlideShift={0}
                      onSnapToItem={(ind) => setIndex(ind)}
                      useScrollView={true} />

            <Pagination dotsLength={tips.length}
                        activeDotIndex={index}
                        carouselRef={isCarousel}
                        dotStyle={styles.dots}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        tappableDots={true} />
        </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20
    },
    containerImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    dots: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.grey
    },
    image: {
        opacity: 0.75
    },
})

export default TipsScreen;