import { ButtonBase, Grid, MenuItem, Skeleton, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Subject, takeUntil } from 'rxjs';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { retrieveCoinsAction } from '../store/coinsSlice';

function Converter() {
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [destroy$] = useState(new Subject<void>());
    const coinsState = useAppSelector(state => state.coins);
    const selectedCurrencyRef = useAppSelector(state => state.navbar.selectedCurrency);
    const [hasMore, setHasMore] = useState(false);
    const dispatch = useAppDispatch();
    const [selectedCoin1, setSelectedCoin1] = useState('');
    const [selectedCoin2, setSelectedCoin2] = useState('');
    const [selectedCoinCount, setSelectedCoinCount] = useState('1');
    const [conversionResult, setConversionResult] = useState(0);

    const retrieveCoins = (offset: number, limit: number) => {
        if (!selectedCurrencyRef.uuid) return;
        return retrieveCoinsAction(coinsState, dispatch, { offset: offset, limit: limit, referenceCurrencyUuid: selectedCurrencyRef.uuid }).pipe(
            takeUntil(destroy$)
        ).subscribe(res => {
            if (offset === 0) { // reset loading for initial call
                setLoading(false);
            }
            if (res.length < 24) {
                setHasMore(false);
            }
            if (res.length > 0) { // we don't need to increment the offset if there is no more data to fetch
                setOffset(offset + limit);
            }
        });
    }

    // Function to calculate the conversion rate
    const calculateConversion = () => {
        const coin1 = coinsState.data.find(coin => coin.uuid === selectedCoin1);
        const coin2 = coinsState.data.find(coin => coin.uuid === selectedCoin2);
        const numberOfCoins = Number(selectedCoinCount);
        
        if (coin1 && coin2 && Number(coin1.price) && Number(coin2.price) !== 0) {
            const conversionRate = Number(coin1.price) * numberOfCoins / Number(coin2.price);
            setConversionResult(conversionRate);
        } else {
            setConversionResult(0);
        }
    };

    const grabName = (uuid: string) => {
        const coin = coinsState.data.find(coin => coin.uuid === uuid);
        return coin ? coin.name : '';
    }

    useEffect(() => {
        if (offset === 0) {
            window.scroll({ top: 0 }); // scroll to top to prevent fetching next page
            retrieveCoins(0, 24);
        } else {
            retrieveCoins(0, offset);
        }

        calculateConversion();

        return () => {
            destroy$.next();
            destroy$.complete();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCurrencyRef]);

    useEffect(() => {
        calculateConversion(); // Calculate conversion whenever selected coins change
    }, [selectedCoin1, selectedCoin2, coinsState.data, selectedCoinCount]);
    
    if (loading) return (
        <Grid container spacing={2}>
            Loading Coins...
        </Grid>
    );

    return (
        <InfiniteScroll style={{ overflow: "inherit" }}
            next={() => retrieveCoins(offset, 24)} dataLength={coinsState.data.length}
            hasMore={hasMore}
            loader={<Skeleton width={"60%"} />}
            scrollThreshold={"20px"}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        label="Number of Coins"
                        value={selectedCoinCount}
                        onChange={(event) => setSelectedCoinCount(event.target.value)}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        label="Select Coin 1"
                        value={selectedCoin1}
                        onChange={(event) => setSelectedCoin1(event.target.value)}
                        fullWidth
                    >
                        {coinsState.data.map((coin) => (
                            <MenuItem key={coin.uuid} value={coin.uuid}>
                                {coin.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        select
                        label="Select Coin 2"
                        value={selectedCoin2}
                        onChange={(event) => setSelectedCoin2(event.target.value)}
                        fullWidth
                    >
                        {coinsState.data.map((coin) => (
                            <MenuItem key={coin.uuid} value={coin.uuid}>
                                {coin.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    {conversionResult !== 0 && (
                        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
                            {selectedCoinCount} {grabName(selectedCoin1)} = {conversionResult.toFixed(2)} {grabName(selectedCoin2)}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </InfiniteScroll>
    );
}

export default Converter;
