import React from 'react';
import { Avatar, ButtonBase, Card, CardContent, CardHeader, Grid, Stack, Typography } from '@mui/material';
import ExchangeModel from '../models/exchange';

const TitleHeader = ({ name, score }: { name: string; score: number }) => {
    let scoreColor = null;
    if (score > 7) {
        scoreColor = "green"
    } else if (score > 4) {
        scoreColor = "orange"
    } else {
        scoreColor = "red";
    }

    return (
        <Stack direction="row">
            <Typography variant='body2' flexGrow={1}>{name}</Typography>

            <Stack direction="row">
                <Typography variant='body2' style={{ marginRight: "0.5rem" }}>Score:</Typography>
                <Typography variant='body2' color={scoreColor}>{score}</Typography>
            </Stack>
        </Stack>
    );
}

interface Props {
    exchange: ExchangeModel;
}

function Exchange({ exchange }: Props) {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <ButtonBase style={{ textAlign: 'left', height: '100%' }} href={exchange.url || ""}>
                <Card sx={{ width: 245, height: '100%' }}>
                    <CardHeader
                        avatar={
                            <Avatar aria-label="recipe" src={exchange.image || ''}>
                                EX
                            </Avatar>
                        }
                        title={<TitleHeader name={exchange.name} score={exchange.trust_score} />}
                        subheader={exchange.id}
                    />
                    <CardContent>
                        <Stack direction="row" spacing={1}>
                            <Typography variant="caption" flexGrow={1}>Year Established</Typography>
                            <Typography variant="caption" color={'primary'} style={{ fontWeight: 'bold' }}>{exchange.year_established ? exchange.year_established : "N/A"}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} marginBottom={2}>
                            <Typography variant="caption" flexGrow={1}>Country</Typography>
                            <Typography variant="caption" color={'primary'} style={{ fontWeight: 'bold' }}>{exchange.country ? exchange.country : "N/A"}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </ButtonBase>
        </Grid>
    );
}

export default Exchange;
