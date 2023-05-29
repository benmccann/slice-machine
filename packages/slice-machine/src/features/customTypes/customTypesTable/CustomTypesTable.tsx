import { type FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
  Icon,
  IconButton,
  Button,
  BlankSlate,
  BlankSlateImage,
  BlankSlateTitle,
  BlankSlateDescription,
  BlankSlateActions,
  Image,
  tokens,
} from "@prismicio/editor-ui";
import { useRouter } from "next/router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@src/components/Table";
import { ReusableIcon } from "@src/components/Icons/ReusableIcon";
import { UniqueIcon } from "@src/components/Icons/UniqueIcon";
import useSliceMachineActions from "@src/modules/useSliceMachineActions";
import { RenameCustomTypeModal } from "@components/Forms/RenameCustomTypeModal";
import { DeleteCustomTypeModal } from "@components/DeleteCTModal";
import { type CustomType } from "@prismicio/types-internal/lib/customtypes";
import {
  useCustomTypes,
  useCustomTypesAutoRevalidation,
} from "./useCustomTypes";
import { type CustomTypeFormat } from "@slicemachine/manager";
import { CUSTOM_TYPES_CONFIG } from "../customTypesConfig";

type CustomTypesTableProps = {
  format: CustomTypeFormat;
  isCreatingCustomType: boolean;
};

export const CustomTypesTable: FC<CustomTypesTableProps> = ({
  format,
  isCreatingCustomType,
}) => {
  const [selectedCustomType, setSelectedCustomType] = useState<CustomType>();
  const {
    openCreateCustomTypeModal,
    openRenameCustomTypeModal,
    openDeleteCustomTypeModal,
  } = useSliceMachineActions();
  const router = useRouter();
  const { customTypes, updateCustomTypes } = useCustomTypes(format);
  const sortedCustomTypes = customTypes.sort(
    (customType1: CustomType, customType2: CustomType) => {
      return customType1.id.localeCompare(customType2.id);
    }
  );
  const customTypesConfig = CUSTOM_TYPES_CONFIG[format];

  useCustomTypesAutoRevalidation(customTypes, format, updateCustomTypes);

  if (sortedCustomTypes.length === 0) {
    return (
      <BlankSlate style={{ marginTop: tokens.size[72] }}>
        <BlankSlateImage>
          <Image src={customTypesConfig.blankSlateImage} sizing="contain" />
        </BlankSlateImage>
        <BlankSlateTitle size="big">
          {customTypesConfig.name({ start: true, plural: true })}
        </BlankSlateTitle>
        <BlankSlateDescription>
          {customTypesConfig.blankSlateDescription}
        </BlankSlateDescription>
        <BlankSlateActions>
          <Button
            size="medium"
            onClick={openCreateCustomTypeModal}
            loading={isCreatingCustomType}
          >
            Create
          </Button>
        </BlankSlateActions>
      </BlankSlate>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Icon name="notes" size="medium" />
            </TableCell>
            <TableCell>Label</TableCell>
            <TableCell>API ID</TableCell>
            <TableCell>Limit</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCustomTypes.map((customType: CustomType) => {
            const { repeatable, label, id } = customType;

            return (
              <TableRow
                key={id}
                onClick={() => {
                  void router.push(
                    `/${customTypesConfig.urlPathSegment}/${id}`
                  );
                }}
              >
                <TableCell>
                  {repeatable ? <ReusableIcon /> : <UniqueIcon />}
                </TableCell>
                <TableCell>{label}</TableCell>
                <TableCell>{id}</TableCell>
                <TableCell>{repeatable ? "Reusable" : "Single"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <IconButton icon="moreVert" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        startIcon={<Icon name="edit" />}
                        onSelect={() => {
                          setSelectedCustomType(customType);
                          openRenameCustomTypeModal();
                        }}
                      >
                        <Text>Rename</Text>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        startIcon={<Icon color="tomato11" name="delete" />}
                        onSelect={() => {
                          setSelectedCustomType(customType);
                          openDeleteCustomTypeModal();
                        }}
                      >
                        <Text color="tomato11">Remove</Text>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedCustomType && (
        <>
          <RenameCustomTypeModal
            customType={selectedCustomType}
            format={format}
          />
          <DeleteCustomTypeModal
            customType={selectedCustomType}
            format={format}
          />
        </>
      )}
    </>
  );
};
