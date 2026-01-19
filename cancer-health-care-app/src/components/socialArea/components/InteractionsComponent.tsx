import { globalStyles } from "@/src/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native"

interface InteractionsComponentProps {
    likes: number,
    comments: number | null,
}

export function InteractionsComponent({ likes: initialLikes, comments }: InteractionsComponentProps) {

    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);

    const handleLike = () => {
        if (isLiked) {
            setLikesCount(prev => prev - 1); 
        } else {
            setLikesCount(prev => prev + 1); 
        }
        setIsLiked(!isLiked); 
    };

    return (
        <View style={styles.interactionsContainer}>
            {/* Bloco de Like */}
            <View style={styles.item}>
                <Pressable onPress={handleLike}>
                    <Ionicons
                        name={isLiked ? "heart" : "heart-outline"}
                        size={28}
                        color={isLiked ? "red" : "black"}
                    />
                </Pressable>
                <Text style={styles.text}>{likesCount}</Text>
            </View>

            {/* Bloco de Comentário */}
            <View style={styles.item}>
                <Pressable>
                    <Ionicons name="chatbubble-outline" size={28} />
                </Pressable>
                <Text style={styles.text}>{comments}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    interactionsContainer: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    text: {
        fontSize: 16,
    }
});