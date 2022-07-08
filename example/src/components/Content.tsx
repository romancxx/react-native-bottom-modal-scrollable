import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  title: string;
}

export const Content: React.FC<Props> = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit
        amet porttitor eros, id rutrum orci. Vestibulum nec felis odio. Ut nec
        neque nec urna viverra tincidunt accumsan at odio. Praesent et felis
        nulla. Duis non volutpat tortor. Aliquam ac scelerisque felis.
        Pellentesque habitant morbi tristique senectus et netus et malesuada
        fames ac turpis egestas. Vivamus porta quis ipsum ac rhoncus. Etiam sit
        amet purus et enim pulvinar posuere. Mauris feugiat varius mi, nec
        sollicitudin mi tempor ut. Pellentesque habitant morbi tristique
        senectus et netus et malesuada fames ac turpis egestas.
      </Text>
      <Text style={styles.text}>
        Donec condimentum lectus non lectus sollicitudin, ac sodales lorem
        scelerisque. Nunc magna purus, tristique quis nunc eget, lobortis
        porttitor felis. Vestibulum ante ipsum primis in faucibus orci luctus et
        ultrices posuere cubilia curae; Vestibulum sed ex euismod, porta dui ac,
        commodo lorem. Nunc scelerisque lobortis arcu, id fringilla augue
        porttitor eget. Nullam vel tortor at lacus volutpat rutrum porttitor
        vitae dolor. Vivamus lectus erat, placerat quis maximus eget, lobortis
        nec mauris. Suspendisse dignissim nibh ut tortor luctus, at pretium
        tortor iaculis. Vestibulum vel erat vel augue vehicula suscipit. Sed
        mollis ante justo, sit amet ullamcorper erat iaculis ac.
      </Text>
      <Text style={styles.text}>
        Nam erat velit, vestibulum eget ligula accumsan, rutrum venenatis arcu.
        Duis vitae est vel urna maximus molestie quis eget libero. Fusce
        convallis justo non purus cursus, a venenatis tellus porttitor. Sed
        pulvinar arcu in orci convallis, in ullamcorper augue tempus. Integer
        vestibulum magna sit amet orci ornare, aliquam pharetra felis mattis.
        Sed felis dolor, malesuada quis mollis eget, efficitur in leo. Sed vitae
        magna varius, pretium felis non, volutpat mi. Duis sit amet pharetra
        nibh. Donec a ultrices ligula. Cras sodales ligula quis metus mollis
        lobortis. Integer vestibulum sodales ligula ac lobortis.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  containerTitle: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 30,
  },
  text: {
    fontSize: 15,
    marginTop: 30,
  },
});
