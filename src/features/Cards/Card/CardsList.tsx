import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import React, { useEffect, useState } from 'react';
import { cardActions, cardThunks } from '../cards.slice';
import { Nullable, Optional } from '../../../common/utils/types/optional.types';
import { CardSortCurrentTypes, CardSortTypes, ICard, ICardQuery } from '../cards.interfaces';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import { PaginationCustom } from '../../Packs/PaginationCustom/Pagination';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { selectorProfileId } from '../../Auth/auth.selector';
import { cardsByPackSelector, cardsTotalCountSelector, currentPackTitleSelector, packUserIdSelector } from '../cards.selector';
import s from './styles.module.scss';
import { superSortCreator } from '../../Packs/utils/super-sort';
import { BodyCards } from './BodyCards/BodyCards';
import { CustomSearch } from 'common/components/CustomSearch/CustomSearch';
import { AddCardModal } from '../Modals/AddCardModal/AddCardModal';
import { CustomButton } from '../../../common/components/CustomButton/CustomButton';
import { MSG_BTN } from '../../../common/utils/constans/app-messages.const';
import { CustomTableHeader } from '../../../common/components/Tables/CustomTableHeader/CustomTableHeader';
import { cardHeadCells } from '../utils/consts/head-cards.const';

export const CardsList = () => {
    const { id } = useParams<{ id: string }>(); // id pack
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const profilerId: Optional<string> = useAppSelector(selectorProfileId);
    const currentPackTitle: Optional<string> = useAppSelector(currentPackTitleSelector);
    const packUserId: Optional<string> = useAppSelector(packUserIdSelector);
    const cardsList: Nullable<ICard[]> = useAppSelector(cardsByPackSelector);
    const cardsTotalCount: Optional<number> = useAppSelector(cardsTotalCountSelector);

    const [isLoading, setIsLoading] = useState(false);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [params, setParams] = useState<ICardQuery>({
        sortCards: '0created',
        page: '1',
        pageCount: '5',
        cardsPack_id: id!,
        cardQuestion: '',
    });

    useEffect(() => {
        setIsLoading(true);
        dispatch(cardThunks.getAllCardsByPack(params))
            .unwrap()
            .catch(() => navigate('/404'))
            .finally(() => setIsLoading(false));
    }, [params]);

    const changePageHandler = (_: unknown, newPage: number) => {
        +params.page !== newPage && setParams({ ...params, page: newPage.toString() });
    };

    const sortCardsHandler = (property: CardSortTypes) => {
        const prop: CardSortCurrentTypes = superSortCreator(property, params.sortCards);
        setParams({ ...params, sortCards: prop });
    };

    const searchHandler = (searchValue: Nullable<string>) => {
        setParams({ ...params, cardQuestion: searchValue?.trim() ?? '' });
    };

    const closeModal = () => {
        if (isLoading) return;
        setIsOpenModal(false);
    };

    const backHandler = () => {
        navigate(-1);
        dispatch(cardActions.resetCurrentPack({}));
    };

    return (
        <>
            <AddCardModal isOpen={isOpenModal} closeModal={closeModal} queryParams={params} packId={id!} />
            <CustomButton onClick={backHandler} startIcon={<ArrowBackIcon />} marginBottom={'30px'}>
                {MSG_BTN.BACK}
            </CustomButton>

            <div className={s.wr}>
                <div className={s.title}>{isLoading ? '' : currentPackTitle}</div>
                {profilerId === packUserId && <CustomButton onClick={() => setIsOpenModal(true)}>{MSG_BTN.CRETE_NEW_CARD}</CustomButton>}
            </div>
            <div className={s.setting_panel}>
                <CustomSearch placeholder={'write question'} searchHandler={searchHandler} searchValue={params.cardQuestion} />
            </div>
            <Box sx={{ width: '100%' }}>
                <Paper elevation={3}>
                    <TableContainer>
                        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                            {/*<HeaderCards disabled={isLoading} changeSort={sortCardsHandler} orderBy={params.sortCards} />*/}
                            <CustomTableHeader changeSort={sortCardsHandler as any} orderBy={params.sortCards} disabled={isLoading} cells={cardHeadCells} />
                            <BodyCards isLoading={isLoading} query={params} />
                        </Table>
                    </TableContainer>

                    {cardsList?.length ? (
                        <PaginationCustom
                            disabled={isLoading}
                            page={+params.page}
                            rowsPerPage={+params.pageCount}
                            totalCount={cardsTotalCount!}
                            handleChangePage={changePageHandler}
                        />
                    ) : (
                        ''
                    )}
                </Paper>
            </Box>
        </>
    );
};
