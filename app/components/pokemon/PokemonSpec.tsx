import { View, Text, ViewProps, ImageSourcePropType, StyleSheet, Image } from 'react-native'
import { Row } from '../Row';
import { ThemeText } from '../ThemeText';

type Props = ViewProps & {
    title?: string;
    description?: string;
    image?: ImageSourcePropType;
};

export function PokemonSpec({ style, image, title, description, ...rest }: Props) {
  return (
    <View style={[style, styles.root]} {...rest}>
      <Row style={styles.row}>
        <Image source={image} width={16} height={16} />
        <ThemeText>{title}</ThemeText>
      </Row>
        <ThemeText variant="caption" color="grayMedium">{description}</ThemeText>
    </View>
  )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        gap: 4,
        alignItems: 'center',
    },
    row: {
        height: 32,
        alignItems: 'center',
    }
})