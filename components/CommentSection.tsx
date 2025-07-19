import { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

type Comment = {
  id: string;
  text: string;
};

type Props = {
  buildingId: string;
};

// Simple in-memory comment store (not persistent)
const commentsStore: { [buildingId: string]: Comment[] } = {};

export default function CommentSection({ buildingId }: Props) {
  const [comments, setComments] = useState<Comment[]>(commentsStore[buildingId] || []);
  const [text, setText] = useState('');

  const handleAddComment = () => {
    if (!text.trim()) return;
    const newComment: Comment = { id: Date.now().toString(), text: text.trim() };
    const updated = [...comments, newComment];
    commentsStore[buildingId] = updated;
    setComments(updated);
    setText('');
  };

  return (
    <View>
      <TextInput
        placeholder="Write a comment..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title="Add Comment" onPress={handleAddComment} />
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text style={styles.comment}>{item.text}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, padding: 8, marginVertical: 10 },
  comment: { padding: 5, borderBottomWidth: 1, borderColor: '#ccc' }
});
