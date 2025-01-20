import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';

import {WebView, WebViewMessageEvent} from 'react-native-webview';

const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My page</title>
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@^18",
          "react-dom": "https://esm.sh/react-dom@^18",
          "react/jsx-runtime": "https://esm.sh/react@^18/jsx-runtime",
          "@mui/material": "https://esm.sh/@mui/material@latest?external=react"
        }
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel" data-type="module">
      import * as React from "react";
      import { createRoot } from "react-dom";
      import {
        colors,
        CssBaseline,
        ThemeProvider,
        Typography,
        Container,
        createTheme,
        Box,
        SvgIcon,
        Slider,
        Link,
      } from "@mui/material";

      const theme = createTheme({
        cssVariables: true,
        palette: {
          primary: {
            main: "rgb(46, 93, 191)",
          },
          secondary: {
            main: "rgb(241, 241, 241)",
          },
          error: {
            main: "rgb(241, 241, 241)",
          },
        },
      });

      const minDistance = 5;

      export default function App() {
        const [value, setValue] = React.useState([20, 80]);
        const [state, setState] = React.useState({
          min: 0,
          step: 1,
          max: 100,
        });

        const handleChange = (event, newValue, activeThumb) => {
          if (!Array.isArray(newValue)) {
            return;
          }

          let changedValue = newValue;

          setValue((prev) => {
            if (activeThumb === 0) {
              changedValue = [
                Math.min(newValue[0], prev[1] - minDistance),
                prev[1],
              ];
            } else {
              changedValue = [
                prev[0],
                Math.max(newValue[1], prev[0] + minDistance),
              ];
            }
            window.ReactNativeWebView.postMessage(JSON.stringify(changedValue));

            return changedValue;
          });
        };

        const marks = React.useMemo(() => {
          return Array.from({ length: 11 })
            .fill("0")
            .map((item, index) => {
              return {
                value: index * 10,
                label: index * 10,
              };
            });
        }, []);

        console.log(value);

        React.useEffect(() => {
          const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            setState((prev) => ({
              ...prev,
              ...data,
            }));
            setValue(() => data.value);
          };

          window.addEventListener("message", handleMessage);

          return () => {
            window.removeEventListener("message", handleMessage);
          };
        }, []);

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100%",
              padding: "0 1rem",
            }}
          >
            <Slider
              aria-label="on"
              value={value}
              onChange={handleChange}
              disableSwap
              marks={marks}
              {...state}
              valueLabelDisplay="on"
            />
          </div>
        );
      }

      const root = createRoot(document.getElementById("root"));
      root.render(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      );
    </script>
  </body>
</html>

`;

export default function SliderWeb({
  startRange,
  endRange,
  start = startRange,
  end = endRange,
  step = 1,
  onChange,
}: {
  startRange: number;
  endRange: number;
  start: number;
  end: number;
  step?: number;
  onChange: ({start, end}: {start: number; end: number}) => void;
}) {
  const [sliderValue, setSliderValue] = useState<number[]>([]);
  const ref = React.useRef<WebView>(null);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const data: number[] = JSON.parse(event.nativeEvent.data);
      console.log(event.nativeEvent.data);
      setSliderValue(data);
      onChange({
        start: data?.[0],
        end: data?.[1],
      });
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  React.useEffect(() => {
    const data = JSON.stringify({
      min: startRange,
      max: endRange,
      step: step,
    });
    ref?.current?.postMessage(data);
  }, [startRange, start, end, step, endRange]);

  React.useEffect(() => {
    const data = JSON.stringify({
      value: [start, end],
    });

    ref?.current?.postMessage(data);
  });

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text,
          {
            color: '#222',
            textAlign: 'left',
          },
        ]}>
        {sliderValue?.[0] ?? '6'}
      </Text>
      <WebView
        source={{
          html,
        }}
        style={{
          flex: 1,
        }}
        onMessage={handleWebViewMessage}
        ref={ref}
        originWhitelist={['*']}
        nestedScrollEnabled
        startInLoadingState
        pullToRefreshEnabled
      />
      <Text
        style={[
          {
            color: '#222',
          },
          styles.text,
        ]}>
        {sliderValue?.[1] ?? '6'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 25,
    width: 50,
    color: '#222',
    textAlign: 'right',
  },
});
