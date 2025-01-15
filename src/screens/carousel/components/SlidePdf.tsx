import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as ReactImage,
  Font,
} from "@react-pdf/renderer";
import HTMLReactParser from "html-react-parser";

// Register Roboto fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "/fonts/robot/Roboto-Medium.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/robot/Roboto-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/robot/Roboto-Italic.ttf",
      fontStyle: "italic",
    },
  ],
});
Font.register({
  family: "Raleway",
  fonts: [
    {
      src: "/fonts/raleway/Raleway-Medium.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/raleway/Raleway-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/raleway/Raleway-Italic.ttf",
      fontStyle: "italic",
    },
  ],
});
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "/fonts/inter/Inter_18pt-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/inter/Inter_18pt-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/inter/Inter_18pt-Italic.ttf",
      fontStyle: "italic",
    },
  ],
});
Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: "/fonts/notoSans/NotoSans_Condensed-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/notoSans/NotoSans_Condensed-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/notoSans/NotoSans_Condensed-Italic.ttf",
      fontStyle: "italic",
    },
  ],
});
Font.register({
  family: "OpenSans",
  fonts: [
    {
      src: "/fonts/openSans/OpenSans_Condensed-Medium.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/openSans/OpenSans_Condensed-Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/openSans/OpenSans_Condensed-Italic.ttf",
      fontStyle: "italic",
    },
  ],
});
Font.register({
  family: "PlayWrite",
  fonts: [
    {
      src: "/fonts/playWrite/PlaywriteIN-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/playWrite/PlaywriteIN-Regular.ttf",
      fontWeight: "bold",
    },
    {
      src: "/fonts/playWrite/PlaywriteIN-Regular.ttf",
      fontStyle: "italic",
    },
  ],
});

const HTMLContent = ({ htmlContent, style, colors, fontSize, font }: any) => {
  const processTextContent = (text: string) => {
    return text.replace(/^\s+|\s+$/g, " ").replace(/\s+/g, " ");
  };

  // Check if content has any HTML tags
  const hasHTMLTags = (content: string) => {
    return /<[a-z][\s\S]*>/i.test(content);
  };

  // Wrap plain text in <p> tags if no HTML tags are present
  const prepareContent = (content: string) => {
    if (!hasHTMLTags(content)) {
      return `<p>${content}</p>`;
    }
    return content;
  };

  const renderNode: any = (node: any, parentStyle = {}) => {
    if (typeof node === "string") {
      return processTextContent(node);
    }

    if (node.type === "text") {
      return processTextContent(node.data);
    }

    if (Array.isArray(node)) {
      return node.map((n, i) => renderNode(n, parentStyle));
    }

    let newStyle = { ...parentStyle };
    let content;

    switch (node.name) {
      case "p":
        return (
          <Text style={[styles.paragraph, style, newStyle]} key={Math.random()}>
            {node.children.map((child: any) => renderNode(child, newStyle))}
          </Text>
        );
      case "strong":
      case "b":
        newStyle = {
          ...newStyle,
          fontWeight: "bold",
          fontFamily: font,
        };
        content = (
          <Text style={newStyle} key={Math.random()}>
            {node.children.map((child: any) => renderNode(child, newStyle))}
          </Text>
        );
        break;
      case "em":
      case "i":
        newStyle = {
          ...newStyle,
          fontStyle: "italic",
          fontFamily: font,
        };
        content = (
          <Text style={newStyle} key={Math.random()}>
            {node.children.map((child: any) => renderNode(child, newStyle))}
          </Text>
        );
        break;
      case "u":
        newStyle = { ...newStyle, textDecoration: "underline" };
        content = (
          <Text style={newStyle} key={Math.random()}>
            {node.children.map((child: any) => renderNode(child, newStyle))}
          </Text>
        );
        break;
      default:
        content = node.children?.map((child: any) =>
          renderNode(child, newStyle)
        );
    }

    return content;
  };

  const processedContent = HTMLReactParser(prepareContent(htmlContent), {
    replace: (node: any) => {
      if (node.type === "tag" || node.type === "text") {
        return renderNode(node, {
          color: colors.secondary,
          fontFamily: font,
          fontSize: parseInt(fontSize),
        });
      }
      return node;
    },
  });

  return <View style={styles.contentWrapper}>{processedContent}</View>;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  slideContainer: {
    width: "100%",
    height: "100%",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    margin: "-100px",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  profileInfo: {
    marginLeft: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  name: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    // fontFamily: "Raleway",
  },
  username: {
    fontSize: 9,
    color: "#666",
    // fontFamily: "Raleway",
  },
  content: {
    marginTop: 20,
    textAlign: "left",
    fontWeight: "normal",
    // fontFamily: "Raleway",
  },
  contentWrapper: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  paragraph: {
    marginBottom: 10,
  },
});

const SlidePDF = ({
  slides,
  colors,
  fontSize,
  profileInfo,
  profileImage,
  font,
}: any) => (
  <Document>
    {slides.map((slide: any, index: any) => (
      <Page key={slide.id} style={styles.page} size={[336, 426]}>
        <View
          style={[
            styles.slideContainer,
            { backgroundColor: colors.background },
          ]}>
          <View style={styles.header}>
            <ReactImage
              style={styles.image}
              src={profileImage || "/img/avatar-dummy.jpeg"}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.primary }]}>
                {profileInfo?.authorName}
              </Text>
              <Text style={[styles.username, { color: colors.primary }]}>
                {profileInfo?.linkedInHandle}
              </Text>
            </View>
          </View>
          <HTMLContent
            htmlContent={slide.content}
            style={styles.content}
            colors={colors}
            fontSize={fontSize}
            font={font}
          />
        </View>
      </Page>
    ))}
  </Document>
);

export default SlidePDF;
