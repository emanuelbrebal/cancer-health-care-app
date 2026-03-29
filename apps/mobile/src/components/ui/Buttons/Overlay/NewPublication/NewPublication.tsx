import React, { useState } from 'react';
import { OverlayButton } from "../OverlayButton";
import CreationBottomSheet from '@/src/app/(Home)/SocialArea/Forum/CreationsHub/BottomSheet';

export function NewPublicationButton() {
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);

  const handleOpenCreationMenu = () => {
    setBottomSheetVisible(true);
  };

  const handleCloseCreationMenu = () => {
    setBottomSheetVisible(false);
  };

  return (
    <>
      <OverlayButton 
        onPress={handleOpenCreationMenu} 
        iconName="add"
        size={50} 
        style={{ width: 50, height: 50 }} 
      />

      <CreationBottomSheet 
        visible={isBottomSheetVisible} 
        onClose={handleCloseCreationMenu} 
      />
    </>
  );
}