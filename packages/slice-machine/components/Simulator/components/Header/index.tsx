import router from "next/router";
import { Box, Text, Flex } from "theme-ui";
import * as Models from "@slicemachine/core/build/models";

import VarationsPopover from "@lib/builders/SliceBuilder/Header/VariationsPopover";
import * as Links from "@lib/builders/SliceBuilder/links";

import ScreenSizes, { Size } from "../ScreenSizes";
import { ComponentUI } from "@lib/models/common/ComponentUI";
import useSliceMachineActions from "src/modules/useSliceMachineActions";
import { useMemo } from "react";
import IframeRenderer from "../IframeRenderer";
import { SliceMachineStoreType } from "@src/redux/type";
import { useSelector } from "react-redux";
import { selectIsWaitingForIFrameCheck } from "@src/modules/simulator";
import { selectSimulatorUrl } from "@src/modules/environment";
import { isLoading } from "@src/modules/loading";
import { LoadingKeysEnum } from "@src/modules/loading/types";
import { ScreenDimensions } from "@lib/models/common/Screenshots";
import { Button } from "@components/Button";
import { AiFillCamera } from "react-icons/ai";

type PropTypes = {
  Model: ComponentUI;
  variation: Models.VariationSM;
  handleScreenSizeChange: (screen: { size: Size }) => void;
  size: Size;
};

const redirect = (
  model: ComponentUI,
  variation: { id: string } | undefined,
  isSimulator?: boolean
): void => {
  if (!variation) {
    void router.push(`/${model.href}/${model.model.name}`);
    return;
  }
  const params = Links.variation({
    lib: model.href,
    sliceName: model.model.name,
    variationId: variation?.id,
    isSimulator,
  });
  void router.push(params.href, params.as, params.options);
};

const deviceToDimensions = (device: Size): ScreenDimensions => {
  switch (device) {
    case Size.FULL:
      return { width: 1200, height: 600 };
    case Size.TABLET:
      return { width: 600, height: 600 };
    case Size.PHONE:
      return { width: 340, height: 600 };
  }
};

const Header: React.FunctionComponent<PropTypes> = ({
  Model,
  variation,
  handleScreenSizeChange,
  size,
}) => {
  const { generateSliceScreenshot } = useSliceMachineActions();

  const onTakingSliceScreenshot = () => {
    generateSliceScreenshot(variation.id, Model, deviceToDimensions(size));
  };

  const { isWaitingForIframeCheck, simulatorUrl, isSavingScreenshot } =
    useSelector((store: SliceMachineStoreType) => ({
      simulatorUrl: selectSimulatorUrl(store),
      isWaitingForIframeCheck: selectIsWaitingForIFrameCheck(store),
      isSavingScreenshot: isLoading(
        store,
        LoadingKeysEnum.GENERATE_SLICE_SCREENSHOT
      ),
    }));

  const sliceView = useMemo(
    () =>
      Model && variation
        ? [
            {
              sliceID: Model.model.id,
              variationID: variation.id,
            },
          ]
        : null,
    [Model.model.id, variation?.id]
  );

  if (!sliceView) return null;

  return (
    <Box
      sx={{
        p: 3,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "1fr",
        borderBottom: "1px solid #F1F1F1",
      }}
    >
      <Flex
        sx={{
          alignItems: "center",
        }}
      >
        <Text mr={2}>{Model.model.name}</Text>
        {Model.model.variations.length > 1 ? (
          <VarationsPopover
            buttonSx={{ p: 1 }}
            defaultValue={variation}
            variations={Model.model.variations}
            onChange={(v) => redirect(Model, v, true)}
          />
        ) : null}
      </Flex>
      <Flex
        sx={{
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <ScreenSizes size={size} onClick={handleScreenSizeChange} />
      </Flex>
      <Flex
        sx={{
          alignItems: "flex-end",
          flexDirection: "column",
        }}
      >
        <Button
          onClick={onTakingSliceScreenshot}
          label="Take a screenshot"
          isLoading={isSavingScreenshot}
          Icon={AiFillCamera}
        />
        {isWaitingForIframeCheck && (
          <IframeRenderer
            dryRun
            size={Size.FULL}
            simulatorUrl={simulatorUrl}
            sliceView={sliceView}
          />
        )}
      </Flex>
    </Box>
  );
};

export default Header;
