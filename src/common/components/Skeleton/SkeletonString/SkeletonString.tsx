import { Skeleton } from '@mui/lab';
import React, { FC } from 'react';

interface SkeletonStringProps {
    fontSize?: string;
}

export const SkeletonString: FC<SkeletonStringProps> = (props) => {
    const { fontSize = '1rem' } = props;
    return <Skeleton variant='text' sx={{ fontSize }} />;
};