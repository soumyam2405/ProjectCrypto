import { ButtonBase, Grid, Skeleton, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useRef, useState,  } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Subject } from 'rxjs';

function News() {
    const [loading, setLoading] = useState(true);
    const [destroy$] = useState(new Subject<void>());
    const [latestNews, setLatestNews] = useState({});

    const retrieveNews = () => {
        fetch("https://newsapi.org/v2/everything?q=cryptocurrencies&apiKey=2b28adf1770b4df0b3c788f4280c18c2").then(res => res.json()).then(res => {
            setLatestNews(res);
            console.log(res)
            setLoading(false);
        });
    }

    useEffect(() => {
        retrieveNews();

        return () => {
            destroy$.next();
            destroy$.complete();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return (
        <Grid container spacing={2}>
            Loading News...
        </Grid>
    );

    return (
        <React.Fragment>
            {
                (latestNews as { articles: string[], status: string, totalResults: Number }).articles.map((article: any) => {
                    return (
                        <p key={article.url}>{ article.title }</p>
                    )
                })
            }

        </React.Fragment>
    );
}

export default News;
