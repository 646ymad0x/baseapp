import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { TabPanel } from 'src/components';
import { P2POffers } from 'src/containers/P2POffers';
import { P2POffersHeader } from 'src/containers/P2POffers/P2POffersHeader';
import { useDocumentTitle, useP2PCurrenciesFetch, useP2PPaymentMethodsFetch, useRangerConnectFetch } from 'src/hooks';
import { P2PCurrency, selectP2PCurrenciesData, selectP2PPaymentMethodsData } from 'src/modules';

export const P2POffersScreen: FC = (): ReactElement => {
    const [tab, setTab] = useState<string>('');
    const [tabMapping, setTabMapping] = useState<string[]>([]);
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [sideFilter, setSideFilter] = useState<string>('buy');
    const [fiatCurrency, setFiatCurrency] = useState<string>('');
    const [fiatCurList, setFiatCurList] = useState<string[]>([]);
    const [paymentFilter, setPaymentFilter] = useState<string>('');

    const currencies = useSelector(selectP2PCurrenciesData);
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);
    const { formatMessage } = useIntl();

    useRangerConnectFetch();
    useP2PCurrenciesFetch();
    useP2PPaymentMethodsFetch();
    useDocumentTitle('P2P');

    useEffect(() => {
        if (currencies.length) {
            const fiatCurrencies = currencies.filter(i => i.type === 'fiat').map(i => i.id.toUpperCase());
            setTabMapping(currencies.filter(i => i.type === 'coin').map(i => i.id));
            setFiatCurList(fiatCurrencies);

            if (fiatCurrencies.length) {
                setFiatCurrency(fiatCurrencies[0]);
            }
        }
    }, [currencies]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);
    const onCurrentTabChange = useCallback((index: number) => setCurrentTabIndex(index), []);

    const onTabChange = useCallback((index: number) => {
        renderTabs();
        if (tab === tabMapping[index]) {
            return;
        }
        setTab(tabMapping[index]);
    }, [tabMapping]);

    const pageContent = useCallback((currency: string) => {
        return (
            <React.Fragment>
                <P2POffersHeader
                    setPayment={setPaymentFilter}
                    onClickSideTab={setSideFilter}
                    paymentsList={paymentMethods.map(i => i.name)}
                    paymentMethod={paymentFilter}
                    onCreateClick={() => window.console.log('create')}
                    side={sideFilter}
                    fiatCurrencies={fiatCurList}
                    setFiatCurrency={setFiatCurrency}
                    fiatCurrency={fiatCurrency}
                />
                <P2POffers
                    cryptoCurrency={currency}
                    baseCurrency={fiatCurrency}
                    paymentMethod={paymentFilter}
                    side={sideFilter}
                />
            </React.Fragment>
        )
    }, [sideFilter, fiatCurrency, paymentMethods, paymentFilter, fiatCurList, tab ]);

    const renderTabs = () => tabMapping.map(i => {
        return {
            content: pageContent(i),
            label: i.toUpperCase(),
        }
    });

    const leftHeader = (
        <React.Fragment>
            <Link to="/p2p/faq" className="pg-p2p-tab__left">{translate('page.body.p2p.header.faq')}</Link>
            <Link to="/p2p/orders" className="pg-p2p-tab__left">{translate('page.body.p2p.header.orders')}</Link>
            <Link to="/p2p/history" className="pg-p2p-tab__left">{translate('page.body.p2p.header.trades_history')}</Link>
        </React.Fragment>
    );

    return (
        <div className="pg-p2p-tab pg-container">
            <div className="pg-p2p-tab__tabs-content">
                <TabPanel
                    panels={renderTabs()}
                    onTabChange={onTabChange}
                    optionalHead={leftHeader}
                    currentTabIndex={currentTabIndex}
                    onCurrentTabChange={onCurrentTabChange}
                />
            </div>
        </div>
    );
};
