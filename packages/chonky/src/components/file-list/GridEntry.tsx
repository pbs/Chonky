import React from 'react';

import { FileEntryProps } from '../../types/file-list.types';
import { FileHelper } from '../../util/file-helper';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import { useFileEntryHtmlProps, useFileEntryState } from './FileEntry-hooks';
import { FileEntryName } from './FileEntryName';
import { FileEntryState, GridEntryPreviewFile, GridEntryPreviewFolder } from './GridEntryPreview';

export const GridEntry: React.FC<FileEntryProps> = React.memo(({ file, selected, focused, dndState }) => {
    const isDirectory = FileHelper.isDirectory(file);
    const entryState = useFileEntryState(file, selected, focused);

    const classes = useFileEntryStyles(entryState);
    const fileEntryHtmlProps = useFileEntryHtmlProps(file);
    const entryClassName = c({
        [classes.gridFileEntry]: true,
    });
    return (
        <div className={entryClassName} {...fileEntryHtmlProps}>
            {isDirectory ? (
                <GridEntryPreviewFolder
                    className={classes.gridFileEntryPreview}
                    entryState={entryState}
                    dndState={dndState}
                />
            ) : (
                <GridEntryPreviewFile
                    className={classes.gridFileEntryPreview}
                    entryState={entryState}
                    dndState={dndState}
                />
            )}
            <div className={classes.gridFileEntryNameContainer}>
                <FileEntryName className={classes.gridFileEntryName} file={file} />
                {Boolean(entryState.childrenCount) && (<div className={classes.nestedChildrenCount}>{entryState.childrenCount} items</div>)}
                {Boolean(entryState.childrenCount == 0) && (<div className={classes.nestedChildrenCount}>Empty folder</div>)}
            </div>
        </div>
    );
});
GridEntry.displayName = 'GridEntry';

const useFileEntryStyles = makeLocalChonkyStyles(theme => ({
    gridFileEntry: {
        flexDirection: 'column',
        display: 'flex',
        height: '93%',
    },
    gridFileEntryPreview: {
        flexGrow: 1,
    },
    gridFileEntryNameContainer: {
        fontSize: theme.gridFileEntry.fontSize,
        wordBreak: 'break-word',
        textAlign: 'left',
        marginLeft: 10,
        paddingTop: 5,
    },
    gridFileEntryName: {
        backgroundColor: 'transparent',
        textDecoration: (state: FileEntryState) => (state.focused ? 'underline' : 'none'),
        borderRadius: 3,
        padding: [2, 0],
        display: '-webkit-box',
        fontWeight: 'bold',
        textOverflow: 'ellipsis',
        width: 155,
        whiteSpace: 'break-spaces',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden'
    },
    nestedChildrenCount: {
        color: '#8186AD'
    }
}));
