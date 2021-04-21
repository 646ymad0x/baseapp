import React, { FC, ReactElement, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { LeftArrowIcon } from '../../../assets/images/slider';
import { History, Pagination } from '../../../components';
import { DEFAULT_TABLE_PAGE_LIMIT } from '../../../../src/constants';
import {
    selectP2PTradesHistoryData,
    selectP2PTradesHistoryLoading,
    p2pTradesHistoryFetch,
    selectP2PTradesHistoryCurrentPage,
    selectP2PTradesHistoryTotalNumber,
    selectP2PTradesHistoryFirstElemIndex,
    selectP2PTradesHistoryLastElemIndex,
    selectP2PTradesHistoryNextPageExists,
    RootState,
    P2POrder,
} from '../../../modules';
import {
    setTradesType,
    setStateType,
} from '../../../helpers';

const TradesHistory: FC = (): ReactElement => {
    const intl = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();

    const list = useSelector(selectP2PTradesHistoryData);
    const fetching = useSelector(selectP2PTradesHistoryLoading);
    const page = useSelector(selectP2PTradesHistoryCurrentPage);
    const total = useSelector(selectP2PTradesHistoryTotalNumber);
    const firstElemIndex = useSelector((state: RootState) => selectP2PTradesHistoryFirstElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectP2PTradesHistoryLastElemIndex(state, DEFAULT_TABLE_PAGE_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectP2PTradesHistoryNextPageExists(state, DEFAULT_TABLE_PAGE_LIMIT));

    const onClickPrevPage = useCallback(() => {
        dispatch(p2pTradesHistoryFetch({ page: Number(page) - 1, limit: DEFAULT_TABLE_PAGE_LIMIT }));
    }, [p2pTradesHistoryFetch, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const onClickNextPage = useCallback(() => {
        dispatch(p2pTradesHistoryFetch({ page: Number(page) + 1, limit: DEFAULT_TABLE_PAGE_LIMIT }));
    }, [p2pTradesHistoryFetch, page, DEFAULT_TABLE_PAGE_LIMIT]);

    const renderHeaders = () => {
        return [
            intl.formatMessage({id: 'page.body.p2p.order_history.date'}),
            intl.formatMessage({id: 'page.body.p2p.order_history.side'}),
            intl.formatMessage({id: 'page.body.p2p.order_history.price'}),
            intl.formatMessage({id: 'page.body.p2p.order_history.quantity'}),
            intl.formatMessage({id: 'page.body.p2p.order_history.counterparty'}),
            intl.formatMessage({id: 'page.body.p2p.order_history.status'}),
            intl.formatMessage({id: 'page.body.p2p.order_history.actions'}),
        ];
    };

    const renderContent = () => {
        return [
            <div className="pg-p2p-trades-history">
                <h1>{intl.formatMessage({id: 'page.body.p2p.order_history.title'})}</h1>
                <span className="pg-p2p-trades-history-back" onClick={() => history.push('/p2p')}>
                    <div className="pg-p2p-trades-history-back-arrow">
                        <LeftArrowIcon className="pg-p2p-trades-history-back-arrow-image"/>
                    </div>
                    {intl.formatMessage({id: 'page.body.p2p.order_history.back'})}
                </span>
                <div className="cr-p2p-history-table">
                    <History headers={renderHeaders()} data={retrieveData()} onSelect={onRowClick}/>
                    {list.length > 0 &&
                    <Pagination
                        firstElemIndex={firstElemIndex}
                        lastElemIndex={lastElemIndex}
                        total={total}
                        page={page}
                        nextPageExists={nextPageExists}
                        onClickPrevPage={onClickPrevPage}
                        onClickNextPage={onClickNextPage}
                    />}
                </div>
            </div>
        ];
    };

    const retrieveData = () => {
        return [...list].map(item => renderTableRow(item));
    };

    const handleCloseDispute = () => {
        console.log('Close dipuste!');
    };

    const onRowClick = useCallback((index: string) => {
        const orderId = list[index]?.id;
        orderId && history.push(`/p2p/order/${orderId}`);
    }, [history, list]);

    const renderDisputeButton = () => {
        return [
            <Button
                onClick={handleCloseDispute}
                size="lg"
                variant="secondary"
            >
                {intl.formatMessage({id: 'page.body.p2p.order_history.close_dispute'})}
            </Button>
        ]
    };

    const renderTableRow = (item: P2POrder) => {
        const { created_at, side, amount, state } = item;
        const { price, quote, base, user } = item.offer;
        const sideColored = setTradesType(side);
        const stateColored = setStateType(state);

        return [
            created_at,
            <span style={{ color: sideColored.color }}>{sideColored.text}</span>,
            `${price} ${base.toUpperCase()}/${quote.toUpperCase()}`,
            `${amount} ${base.toUpperCase()}`,
            user?.user_nickname,
            <span style={{ color: stateColored.color }}>{stateColored.text}</span>,
            state === 'dispute' ? renderDisputeButton() : null,
        ];
    };

    React.useEffect(() => {
        dispatch(p2pTradesHistoryFetch({ limit: DEFAULT_TABLE_PAGE_LIMIT, page }));
    }, [dispatch]);

    return (
        <div>
            {fetching && <div className="text-center"><Spinner animation="border" variant="primary" /></div>}
            {list.length ? renderContent() : null}
            {!list.length && !fetching ? <p className="pg-history-elem__empty">{intl.formatMessage({id: 'page.noDataToShow'})}</p> : null}
        </div>
    );
};

export const P2PTradesHistory = React.memo(TradesHistory);
