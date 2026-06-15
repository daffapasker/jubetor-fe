import { LIMIT_LISTS } from "@/constant/list.constant";
import { cn } from "@/lib/utils";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ChangeEvent, Key, ReactNode, useMemo } from "react";
import { CiSearch } from "react-icons/ci";

interface PropTypes {
  buttonTopContentLabel?: string;
  columns: Record<string, unknown>[];
  currentPage: number;
  data: Record<string, unknown>[];
  emptyContent: string;
  isLoading?: boolean;
  limit: string;
  onChangeLimit: (e: ChangeEvent<HTMLSelectElement>) => void;
  onChangePage: (page: number) => void;
  onChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onClickButtonTopContent?: () => void;
  renderCell: (item: Record<string, unknown>, columnKey: Key) => ReactNode;
  totalPages: number;
}

const DataTable = (props: PropTypes) => {
  const {
    buttonTopContentLabel,
    columns,
    currentPage,
    data,
    emptyContent,
    isLoading,
    limit,
    onChangePage,
    onChangeLimit,
    onClickButtonTopContent,
    onChangeSearch,
    onClearSearch,
    renderCell,
    totalPages,
  } = props;

  const TopContent = useMemo(() => {
    return (
      <div className="flex flex-row items-center justify-between gap-4">
        <Input
          isClearable
          className="w-full max-w-xs"
          placeholder="Search..."
          startContent={<CiSearch className="text-default-400 shrink-0" />}
          onChange={onChangeSearch}
          onClear={onClearSearch}
          aria-label="Search"
          autoComplete="off"
        />
        {buttonTopContentLabel && (
          <Button
            color="danger"
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-medium"
            onPress={onClickButtonTopContent}
          >
            {buttonTopContentLabel}
          </Button>
        )}
      </div>
    );
  }, [
    buttonTopContentLabel,
    onClickButtonTopContent,
    onChangeSearch,
    onClearSearch,
  ]);

  const BottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between gap-4 px-2 py-2">
        <Select
          className="max-w-36"
          size="sm"
          selectedKeys={[limit]}
          selectionMode="single"
          onChange={onChangeLimit}
          startContent={<p className="text-sm text-default-500 shrink-0">Show:</p>}
          disallowEmptySelection
          aria-label="Limit"
        >
          {LIMIT_LISTS.map((item) => (
            <SelectItem key={item.value}>{item.label}</SelectItem>
          ))}
        </Select>

        {totalPages > 1 ? (
          <Pagination
            isCompact
            showControls
            color="danger"
            page={currentPage}
            total={totalPages}
            onChange={onChangePage}
            loop
          />
        ) : (
          // Placeholder to keep layout stable when there's only 1 page
          <div />
        )}
      </div>
    );
  }, [limit, currentPage, totalPages, onChangeLimit, onChangePage]);

  return (
    <Table
      bottomContent={BottomContent}
      bottomContentPlacement="outside"
      classNames={{
        base: "w-full",
        wrapper: cn("overflow-x-auto", {
          "overflow-hidden": isLoading,
        }),
      }}
      topContent={TopContent}
      topContentPlacement="outside"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid as Key}>
            {column.name as string}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent={emptyContent}
        isLoading={isLoading}
        loadingContent={
          <div className="z-10 flex h-full w-full items-center justify-center bg-foreground-500/30 backdrop-blur-sm">
            <Spinner color="danger" />
          </div>
        }
      >
        {(item) => (
          <TableRow key={(item._id || item.id) as Key}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;