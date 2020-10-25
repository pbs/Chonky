/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, {
    CSSProperties,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useSelector } from 'react-redux';
import { VariableSizeGrid } from 'react-window';

import { selectDisplayFileIds, selectFileViewConfig } from '../../redux/selectors';
import { FileViewConfig } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { useIsMobileBreakpoint } from '../../util/styles';
import { isMobileDevice } from '../../util/validation';
import { fileListItemRenderer } from './FileList-hooks';

export interface FileListGridProps {
    width: number;
    height: number;
}

interface GridConfig {
    rowCount: number;
    columnCount: number;
    gutter: number;
    rowHeight: number;
    columnWidth: number;
}

export const getGridConfig = (
    width: number,
    fileCount: number,
    viewConfig: FileViewConfig,
    isMobileBreakpoint: boolean
): GridConfig => {
    const gutter = isMobileBreakpoint ? 5 : 8;
    const scrollbar = isMobileDevice() ? 0 : 18;

    let columnCount: number;
    let columnWidth: number;
    if (isMobileBreakpoint) {
        columnCount = 2;
        columnWidth = (width - gutter - scrollbar) / columnCount;
    } else {
        columnWidth = viewConfig.entryWidth!;
        columnCount = Math.max(
            1,
            Math.floor((width - scrollbar) / (columnWidth + gutter))
        );
    }

    const rowCount = Math.ceil(fileCount / columnCount);

    return {
        rowCount,
        columnCount,
        gutter,
        rowHeight: viewConfig.entryHeight,
        columnWidth,
    };
};

export const FileListGrid: React.FC<FileListGridProps> = React.memo((props) => {
    const { width, height } = props;

    const viewConfig = useSelector(selectFileViewConfig);
    const displayFileIds = useSelector(selectDisplayFileIds);
    const fileCount = useMemo(() => displayFileIds.length, [displayFileIds]);

    const gridRef = useRef<VariableSizeGrid>();
    const isMobileBreakpoint = useIsMobileBreakpoint();

    // Whenever the grid config changes at runtime, we call a method on the
    // `VariableSizeGrid` handle to reset column width/row height cache.
    // !!! Note that we deliberately update the `gridRef` firsts and update the React
    //     state AFTER that. This is needed to avoid file entries jumping up/down.
    const [gridConfig, setGridConfig] = useState(
        getGridConfig(width, fileCount, viewConfig, isMobileBreakpoint)
    );
    const gridConfigRef = useRef(gridConfig);
    useEffect(() => {
        const oldConf = gridConfigRef.current;
        const newConf = getGridConfig(width, fileCount, viewConfig, isMobileBreakpoint);

        gridConfigRef.current = newConf;
        if (gridRef.current) {
            if (oldConf.rowCount !== newConf.rowCount) {
                gridRef.current.resetAfterRowIndex(
                    Math.min(oldConf.rowCount, newConf.rowCount) - 1
                );
            }
            if (oldConf.columnCount !== newConf.columnCount) {
                gridRef.current.resetAfterColumnIndex(
                    Math.min(oldConf.columnCount, newConf.rowCount) - 1
                );
            }
            if (oldConf.columnWidth !== newConf.columnWidth) {
                gridRef.current.resetAfterIndices({ columnIndex: 0, rowIndex: 0 });
            }
        }

        setGridConfig(newConf);
    }, [
        setGridConfig,
        gridConfigRef,
        isMobileBreakpoint,
        width,
        viewConfig,
        fileCount,
    ]);

    const sizers = useMemo(() => {
        const gc = gridConfigRef;
        return {
            getColumnWidth: (index: number) =>
                gc.current.columnWidth! +
                (index === gc.current.columnCount - 1 ? 0 : gc.current.gutter),
            getRowHeight: (index: number) =>
                gc.current.rowHeight +
                (index === gc.current.rowCount - 1 ? 0 : gc.current.gutter),
        };
    }, [gridConfigRef]);

    const displayFileIdsRef = useInstanceVariable(useSelector(selectDisplayFileIds));
    const getItemKey = useCallback(
        (data: { columnIndex: number; rowIndex: number; data: any }) => {
            const index =
                data.rowIndex * gridConfigRef.current.columnCount + data.columnIndex;

            return displayFileIdsRef.current[index] ?? `loading-file-${index}`;
        },
        [gridConfigRef, displayFileIdsRef]
    );

    const cellRenderer = useCallback(
        (data: { rowIndex: number; columnIndex: number; style: CSSProperties }) => {
            const gc = gridConfigRef;
            const index = data.rowIndex * gc.current.columnCount + data.columnIndex;
            return fileListItemRenderer(
                index,
                displayFileIds[index],
                true,
                data.style,
                data.rowIndex === gc.current.rowCount - 1 ? 0 : gc.current.gutter,
                data.columnIndex === gc.current.columnCount - 1 ? 0 : gc.current.gutter
            );
        },
        [gridConfigRef, displayFileIds]
    );

    const gridComponent = useMemo(() => {
        return (
            <VariableSizeGrid
                ref={gridRef as any}
                className="chonky-file-list-grid-view"
                estimatedRowHeight={gridConfig.rowHeight + gridConfig.gutter}
                rowHeight={sizers.getRowHeight}
                estimatedColumnWidth={gridConfig.columnWidth + gridConfig.gutter}
                columnWidth={sizers.getColumnWidth}
                columnCount={gridConfig.columnCount}
                height={height}
                rowCount={gridConfig.rowCount}
                width={width}
                itemKey={getItemKey}
            >
                {cellRenderer}
            </VariableSizeGrid>
        );
    }, [width, height, gridConfig, sizers, getItemKey, cellRenderer]);

    return gridComponent;
});
