import { useState } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';

/**
 * Se o conteúdo cabe na tela, se comporta como uma View (sem rolagem nem bounce).
 * A rolagem só é ativada quando o conteúdo excede a altura disponível
 * (telas pequenas, teclado aberto, mensagens de erro).
 */
export function FitScrollView({ onLayout, onContentSizeChange, contentContainerStyle, ...rest }: ScrollViewProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const overflows = containerHeight > 0 && contentHeight > containerHeight + 1;

  return (
    <ScrollView
      {...rest}
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      scrollEnabled={overflows}
      bounces={overflows}
      showsVerticalScrollIndicator={overflows}
      keyboardShouldPersistTaps="handled"
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height);
        onLayout?.(e);
      }}
      onContentSizeChange={(w, h) => {
        setContentHeight(h);
        onContentSizeChange?.(w, h);
      }}
    />
  );
}
