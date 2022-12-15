import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SharedSliceEditor } from "@prismicio/editor-fields";

import { defaultSharedSliceContent } from "@src/utils/editor";

import { Box, Flex, Spinner } from "theme-ui";

import Header from "./components/Header";

import Tracker from "@src/tracking/client";
import { useSelector } from "react-redux";
import {
  getCurrentVersion,
  getFramework,
  selectSimulatorUrl,
} from "@src/modules/environment";
import { SliceMachineStoreType } from "@src/redux/type";

import ScreenshotPreviewModal from "@components/ScreenshotPreviewModal";
import { Toolbar } from "./components/Toolbar";
import {
  ScreenSizeOptions,
  ScreenSizes,
} from "./components/Toolbar/ScreensizeInput";
import { ScreenDimensions } from "@lib/models/common/Screenshots";
import { Slices } from "@slicemachine/core/build/models";
import { renderSliceMock } from "@prismicio/mocks";

import { ThemeProvider } from "@prismicio/editor-ui";

import { SharedSliceContent } from "@prismicio/types-internal/lib/content/fields/slices/SharedSliceContent";

import useThrottle from "@src/hooks/useThrottle";
import useSliceMachineActions from "@src/modules/useSliceMachineActions";

import IframeRenderer from "./components/IframeRenderer";
import { ComponentWithSliceProps } from "@src/layouts/WithSlice";
import {
  selectIframeStatus,
  selectIsWaitingForIFrameCheck,
  selectSetupStatus,
} from "@src/modules/simulator";
import FullPage from "./components/FullPage";
import FailedConnect from "./components/FailedConnect";
import SetupModal from "./components/SetupModal";

export enum UiState {
  LOADING_SETUP = "LOADING_SETUP",
  LOADING_IFRAME = "LOADING_IFRAME",
  FAILED_SETUP = "FAILED_SETUP",
  FAILED_CONNECT = "FAILED_CONNECT",
  SUCCESS = "SUCCESS",
}

const MemoedSetupModal = memo(SetupModal);

const Simulator: ComponentWithSliceProps = ({ slice, variation }) => {
  const { checkSimulatorSetup, connectToSimulatorIframe, saveSliceMock } =
    useSliceMachineActions();
  const {
    framework,
    version,
    simulatorUrl,
    iframeStatus,
    manifestStatus,
    isWaitingForIFrameCheck,
  } = useSelector((state: SliceMachineStoreType) => ({
    framework: getFramework(state),
    simulatorUrl: selectSimulatorUrl(state),
    version: getCurrentVersion(state),
    iframeStatus: selectIframeStatus(state),
    manifestStatus: selectSetupStatus(state).manifest,
    isWaitingForIFrameCheck: selectIsWaitingForIFrameCheck(state),
  }));

  useEffect(() => {
    checkSimulatorSetup();
    void Tracker.get().trackOpenSliceSimulator(framework, version);
    Tracker.get().editor.startNewSession();
  }, []);

  useEffect(() => {
    if (manifestStatus === "ok") {
      connectToSimulatorIframe();
    }
  }, [manifestStatus]);

  const [iframeCheckFailedOnce, setIframeCheckFailedOnce] = useState(false);

  const currentState: UiState = (() => {
    if (manifestStatus === "ok") {
      if (isWaitingForIFrameCheck || !iframeStatus) {
        return iframeCheckFailedOnce
          ? UiState.FAILED_CONNECT
          : UiState.LOADING_IFRAME;
      }
      if (iframeStatus === "ko") {
        return UiState.FAILED_CONNECT;
      }
      return UiState.SUCCESS;
    } else if (manifestStatus === "ko") {
      return UiState.FAILED_SETUP;
    }
    if (iframeCheckFailedOnce) {
      return UiState.FAILED_CONNECT;
    }
    return UiState.LOADING_SETUP;
  })();

  const [screenDimensions, setScreenDimensions] = useState<ScreenDimensions>(
    ScreenSizes[ScreenSizeOptions.DESKTOP]
  );

  const sharedSlice = useMemo(() => Slices.fromSM(slice.model), [slice.model]);

  const initialContent = useMemo<SharedSliceContent>(
    () =>
      slice.mock?.find((m) => m.variation === variation.id) ||
      defaultSharedSliceContent(variation.id),
    [slice.mock, variation.id]
  );

  const [editorContent, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [variation.id, initialContent]);

  const initialApiContent = useMemo(
    () =>
      renderSliceMock(sharedSlice, editorContent) as {
        id: string;
        [k: string]: unknown;
      },
    []
  );

  const renderSliceMockCb = useCallback(
    () => () => ({
      // cast as object because type is unknown
      ...(renderSliceMock(sharedSlice, editorContent) as object),
      id: initialApiContent.id,
    }),
    [sharedSlice, editorContent, initialApiContent]
  );

  const apiContent = useThrottle(renderSliceMockCb, 800, [
    sharedSlice,
    editorContent,
  ]);

  const [isDisplayEditor, toggleIsDisplayEditor] = useState(false);

  const setupIntervalId = useRef<NodeJS.Timeout | null>(null);
  const iframeIntervalId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentState === UiState.FAILED_SETUP) {
      const id = setInterval(() => {
        checkSimulatorSetup();
      }, 3000);
      if (!setupIntervalId.current) {
        setupIntervalId.current = id;
        return;
      }
    }
    if (currentState === UiState.FAILED_CONNECT) {
      setIframeCheckFailedOnce(true);
      if (!isWaitingForIFrameCheck) {
        const id = setInterval(() => {
          connectToSimulatorIframe();
        }, 3000);
        if (!iframeIntervalId.current) {
          iframeIntervalId.current = id;
          return;
        }
      }
    }
    if (setupIntervalId.current) {
      clearTimeout(setupIntervalId.current);
    }
    if (iframeIntervalId.current) {
      clearTimeout(iframeIntervalId.current);
    } else if (currentState === UiState.SUCCESS) {
      toggleIsDisplayEditor(true);
    }
  }, [
    currentState,
    checkSimulatorSetup,
    connectToSimulatorIframe,
    isWaitingForIFrameCheck,
  ]);

  useEffect(() => {
    if (currentState === UiState.FAILED_CONNECT && !iframeCheckFailedOnce) {
      void Tracker.get().trackSliceSimulatorIsNotRunning(framework);
    }
  }, [currentState, framework, iframeCheckFailedOnce]);

  return (
    <Flex sx={{ flexDirection: "column", height: "100vh" }}>
      <MemoedSetupModal isOpen={currentState === UiState.FAILED_SETUP} />
      <Header
        slice={slice}
        variation={variation}
        isDisplayEditor={isDisplayEditor}
        actionsDisabled={currentState !== UiState.SUCCESS}
        toggleIsDisplayEditor={() => toggleIsDisplayEditor(!isDisplayEditor)}
        onSaveMock={() =>
          saveSliceMock({
            sliceName: slice.model.name,
            libraryName: slice.from,
            mock: (slice.mock || [])
              .filter((mock) => mock.variation !== initialContent.variation)
              .concat(editorContent),
          })
        }
      />
      <Box
        sx={{
          flex: 1,
          bg: "grey07",
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "calc(100% - 73px - 16px)",
        }}
      >
        <Flex
          sx={{
            flex: 1,
            flexDirection: "row",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Flex
            sx={{
              height: "100%",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <Toolbar
              slice={slice}
              variation={variation}
              handleScreenSizeChange={setScreenDimensions}
              screenDimensions={screenDimensions}
              actionsDisabled={currentState !== UiState.SUCCESS}
            />
            {currentState === UiState.FAILED_CONNECT ? <FailedConnect /> : null}
            {currentState === UiState.SUCCESS ? (
              <IframeRenderer
                apiContent={apiContent}
                screenDimensions={screenDimensions}
                simulatorUrl={simulatorUrl}
              />
            ) : (
              <>
                {[
                  UiState.LOADING_IFRAME,
                  UiState.LOADING_SETUP,
                  UiState.FAILED_CONNECT,
                ].includes(currentState) ? (
                  <>
                    {currentState === UiState.FAILED_CONNECT ? (
                      <IframeRenderer
                        apiContent={apiContent}
                        screenDimensions={screenDimensions}
                        simulatorUrl={simulatorUrl}
                        dryRun
                      />
                    ) : (
                      <FullPage>
                        <Spinner variant="styles.spinner" />
                        <IframeRenderer
                          apiContent={apiContent}
                          screenDimensions={screenDimensions}
                          simulatorUrl={simulatorUrl}
                          dryRun
                        />
                      </FullPage>
                    )}
                  </>
                ) : null}
              </>
            )}
          </Flex>
          {currentState === UiState.SUCCESS ? (
            <Box
              sx={{
                height: "100%",
                overflowY: "scroll",
                ...(isDisplayEditor
                  ? {
                      marginLeft: "16px",
                      visibility: "visible",
                      width: "496px",
                    }
                  : {
                      marginLeft: "0px",
                      visibility: "hidden",
                      width: "0",
                    }),
                transition: "visibility 0s linear",
              }}
            >
              <ThemeProvider mode="light">
                <SharedSliceEditor
                  content={editorContent}
                  onContentChange={(c) => {
                    setContent(c as SharedSliceContent);
                    Tracker.get().editor.trackWidgetUsed();
                  }}
                  sharedSlice={sharedSlice}
                />
              </ThemeProvider>
            </Box>
          ) : null}
        </Flex>
      </Box>
      {!!slice.screenshots[variation.id]?.url && (
        <ScreenshotPreviewModal
          sliceName={slice.model.name}
          screenshotUrl={slice.screenshots[variation.id]?.url}
        />
      )}
    </Flex>
  );
};

export default Simulator;
