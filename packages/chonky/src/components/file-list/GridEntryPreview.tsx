/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { useContext, useEffect } from 'react';
import { Nullable } from 'tsdef';

import { DndEntryState } from '../../types/file-list.types';
import { ChonkyIconName } from '../../types/icons.types';
import { ChonkyIconContext } from '../../util/icon-helper';
import { c, important, makeLocalChonkyStyles } from '../../util/styles';
import { FileThumbnail } from './FileThumbnail';
import { GridEntryDndIndicator } from './GridEntryDndIndicator';

export type FileEntryState = {
    childrenCount: Nullable<number>;
    color: string;
    icon: ChonkyIconName | string;
    thumbnailUrl: Nullable<string>;
    iconSpin: boolean;
    selected: boolean;
    focused: boolean;
};

export interface FileEntryPreviewProps {
    className?: string;
    entryState: FileEntryState;
    dndState: DndEntryState;
}

export const GridEntryPreviewFolder: React.FC<FileEntryPreviewProps> = React.memo(props => {
    const { className: externalClassName, entryState, dndState } = props;

    const folderClasses = useFolderStyles(entryState);
    const fileClasses = useFileStyles(entryState);
    const commonClasses = useCommonEntryStyles(entryState);
    const className = c({
        [folderClasses.previewFile]: true,
        [externalClassName || '']: !!externalClassName,
    });
    return (
        <div className={className}>
            <div className={commonClasses.selectionIndicator}></div>
            <div className={folderClasses.filerFolderIcon}></div>
            {/* <div className={folderClasses.folderBackSideMid}> */}
                {/* <div className={folderClasses.folderBackSideTop} /> */}
                {/* <div className={folderClasses.folderFrontSide}> */}
                    {/* <GridEntryDndIndicator className={fileClasses.dndIndicator} dndState={dndState} /> */}
                    {/* <div className={c([fileClasses.fileIcon, folderClasses.fileIcon])}>{entryState.childrenCount}</div> */}
                    {/* <div className={commonClasses.selectionIndicator}></div> */}
                    {/* <FileThumbnail className={fileClasses.thumbnail} thumbnailUrl={entryState.thumbnailUrl} /> */}
                {/* </div> */}
            {/* </div> */}
        </div>
    );
});
GridEntryPreviewFolder.displayName = 'GridEntryPreviewFolder';

const useFolderStyles = makeLocalChonkyStyles(theme => ({
    previewFile: {
        borderRadius: theme.gridFileEntry.borderRadius,
        position: 'relative',
        overflow: 'hidden',
    },
    folderBackSideTop: {
        backgroundColor: (state: FileEntryState) => state.color,
        boxShadow: (state: FileEntryState) => {
            let color = theme.gridFileEntry.folderBackColorTint;
            if (state.focused) color = 'rgba(0, 0, 0, 0.3)';
            else if (state.selected) color = 'rgba(0, 153, 255, .4)';
            return `inset ${color} 0 0 0 999px`;
        },
        borderTopLeftRadius: theme.gridFileEntry.borderRadius,
        borderTopRightRadius: 10,
        position: 'absolute',
        right: '60%',
        height: 13,
        top: -10,
        left: 0,
        '&:after': {
            borderRightColor: theme.palette.background.paper,
            borderTopColor: theme.palette.background.paper,
            borderBottomColor: 'transparent',
            borderLeftColor: 'transparent',
            borderWidth: [0, 15, 10, 0],
            borderStyle: 'solid',
            position: 'absolute',
            display: 'block',
            content: '""',
            right: 0,
            top: 0,
        },
    },
    folderBackSideMid: {
        backgroundColor: (state: FileEntryState) => state.color,
        boxShadow: (state: FileEntryState) => {
            let color = theme.gridFileEntry.folderBackColorTint;
            if (state.focused) color = 'rgba(0, 0, 0, 0.3)';
            else if (state.selected) color = 'rgba(0, 153, 255, .4)';
            return `inset ${color} 0 0 0 999px`;
        },
        borderTopRightRadius: theme.gridFileEntry.borderRadius,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        top: 10,
    },
    folderFrontSide: {
        boxShadow: (state: FileEntryState) => {
            const shadows: string[] = [];
            if (state.focused) shadows.push('inset rgba(0, 0, 0, 1) 0 0 0 3px');
            if (state.selected) shadows.push('inset rgba(0, 153, 255, .65) 0 0 0 3px');
            shadows.push(`inset ${theme.gridFileEntry.folderFrontColorTint} 0 0 0 999px`);
            return shadows.join(', ');
        },
        backgroundColor: (state: FileEntryState) => state.color,
        borderRadius: theme.gridFileEntry.borderRadius,
        position: 'absolute',
        overflow: 'hidden',
        bottom: 0,
        right: 0,
        left: 0,
        top: 10,
    },
    fileIcon: {
        fontSize: important(theme.gridFileEntry.childrenCountSize),
        color: '#2B7DBC'
    },
    filerFolderIcon: {
        width: 61,
        height: 50,
        margin: '10px 0 0 10px',
        backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjIiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA2MiA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTU1LjAyMTcgNi41NTcwOEgzOC4wNTYzQzM3LjI2MDEgNi41NTM2NyAzNi40OTcyIDYuMjMyNjQgMzUuOTMxOSA1LjY2MzE5TDMxLjYyMjIgMS4yODYyMkMzMS4wNTY5IDAuNzE2NzcyIDMwLjI5NCAwLjM5NTczOSAyOS40OTc4IDAuMzkyMzM0SDYuNDYyNDhDMy4xMTAxNyAwLjM5MjMzNCAwLjM5MjU3OCAzLjE1MjM4IDAuMzkyNTc4IDYuNTU3MDhWNDMuNTQ1NUMwLjM5MjU3OCA0Ni45NTAyIDMuMTEwMTcgNDkuNzEwMyA2LjQ2MjQ4IDQ5LjcxMDNINTUuMDIxN0M1OC4zNzQgNDkuNzEwMyA2MS4wOTE2IDQ2Ljk1MDIgNjEuMDkxNiA0My41NDU1VjEyLjcyMThDNjEuMDkxNiA5LjMxNzEzIDU4LjM3NCA2LjU1NzA4IDU1LjAyMTcgNi41NTcwOFoiIGZpbGw9IiMyQjdEQkMiLz4KPC9zdmc+Cg==);",
    }
}));

export const GridEntryPreviewFile: React.FC<FileEntryPreviewProps> = React.memo(props => {
    const { className: externalClassName, entryState, dndState } = props;

    const fileClasses = useFileStyles(entryState);
    const commonClasses = useCommonEntryStyles(entryState);
    const ChonkyIcon = useContext(ChonkyIconContext);
    const className = c({
        [fileClasses.previewFile]: true,
        [externalClassName || '']: !!externalClassName,
    });
    return (
        <div className={className}>
            <GridEntryDndIndicator className={fileClasses.dndIndicator} dndState={dndState} />
            <div className={fileClasses.fileIcon}>
                <ChonkyIcon icon={entryState.icon} spin={entryState.iconSpin} />
            </div>
            <div className={commonClasses.selectionIndicator}></div>
            <FileThumbnail className={fileClasses.thumbnail} thumbnailUrl={entryState.thumbnailUrl} />
        </div>
    );
});
GridEntryPreviewFile.displayName = 'GridEntryPreviewFile';

const useFileStyles = makeLocalChonkyStyles(theme => ({
    previewFile: {
        boxShadow: (state: FileEntryState) => {
            const shadows: string[] = [];
            if (state.selected) shadows.push('inset rgba(0,153,255, .65) 0 0 0 3px');
            if (state.focused) shadows.push('inset rgba(0, 0, 0, 1) 0 0 0 3px');
            shadows.push(`inset ${theme.gridFileEntry.fileColorTint} 0 0 0 999px`);
            return shadows.join(', ');
        },
        // backgroundColor: (state: FileEntryState) => state.color,
        borderRadius: theme.gridFileEntry.borderRadius,
        position: 'relative',
        overflow: 'hidden',
    },
    dndIndicator: {
        zIndex: 14,
    },
    fileIcon: {
        transform: 'translateX(-50%) translateY(-50%)',
        // fontSize: theme.gridFileEntry.iconSize,
        fontSize: '3.4em',
        opacity: (state: FileEntryState) => (state.thumbnailUrl && !state.focused ? 0 : 1),
        // color: (state: FileEntryState) =>
        //     state.focused ? theme.gridFileEntry.iconColorFocused : theme.gridFileEntry.iconColor,
        color: '#2B7DBC',
        position: 'absolute',
        left: 33,
        zIndex: 12,
        top: 38,
    },
    thumbnail: {
        borderRadius: theme.gridFileEntry.borderRadius,
        position: 'absolute',
        zIndex: 6,
        bottom: 5,
        right: 5,
        left: 5,
        top: 5,
    },
}));

export const useCommonEntryStyles = makeLocalChonkyStyles(() => ({
    selectionIndicator: {
        display: (state: FileEntryState) => (state.selected ? 'block' : 'none'),
        background:
            'repeating-linear-gradient(' +
            '45deg,' +
            'rgba(0,153,255,.14),' +
            'rgba(0,153,255,.14) 10px,' +
            'rgba(0,153,255,.25) 0,' +
            'rgba(0,153,255,.25) 20px' +
            ')',
        backgroundColor: 'rgba(0, 153, 255, .14)',
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 10,
    },
    focusIndicator: {
        display: (state: FileEntryState) => (state.focused ? 'block' : 'none'),
        boxShadow: 'inset rgba(0, 0, 0, 1) 0 0 0 2px',
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 11,
    },
}));
