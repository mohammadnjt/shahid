import React, { useEffect } from 'react';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import PostDetailScreen from '../../screens/PostDetailScreen';

// This file lives inside the tabs group. To avoid breaking the tab layout
// we simply forward any access to this route to the top-level `/posts/[postId]`
// route (which is outside the tabs group).
export default function index() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  console.log('params',params)
  const postId = params.postId || params.id;
console.log('postId2',postId)
  if(params.r === 'post' && params.postId){
    return PostDetailScreen({ postId, navigation });
  }
  // useEffect(() => {
  //   // if (postId) {
  //   //   router.replace(`/posts/${postId}`);
  //   // }
  // }, [postId]);

  return null;
}
