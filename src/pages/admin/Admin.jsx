import { useState, useEffect } from 'react';
import { Users } from './Users';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';

import getRawg from '../../services/rawg/getRawg';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import getAllFeatured from '../../services/featured/getAllFeatured';
import patchFeaturedGames from '../../services/admin/patchFeaturedGames';

export const Admin = () => {
    const axiosPrivate = useAxiosPrivate();
    
    const [rawg, setRawg] = useState('');
    const [searchedGames, setSearchedGames] = useState([]);
    const [featuredGames, setFeaturedGames] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getAllFeatured();
            const getFeatured = response.data.map(game => game)
            setFeaturedGames(getFeatured);
            const rawgResponse = await getRawg();
            setRawg(rawgResponse)
        } catch (err) {
            console.log(err);
        }
    };

    const handleFormSubmit = async (game) => {
        try {
            await fetch(`https://api.rawg.io/api/games?key=${rawg}&platforms=187&search=${game}&page_size=6`)
            .then(response => response.json())
            .then(response => {
                const games = response.results;
    
                const gameData = games.map((game) => ({
                    colorDom: game.dominant_color,
                    colorSat: game.saturated_color,
                    esrb: game.esrb_rating?.name || 'No Rating',
                    gameId: game.id,
                    image: game.background_image,
                    metacritic: game.metacritic || 0,
                    name: game.name,
                    rating: game.rating || 0,
                    released: game.released,
                    slug: game.slug,
                }));

                setSearchedGames(gameData);
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleGameOTMonth = async (game) => {
        patchFeaturedGames(axiosPrivate, game, "Game of the Month");
        setFeaturedGames(prev => ([game, prev[1], prev[2], prev[3]]))
    }

    const handleFeature1 = async (game) => {
        patchFeaturedGames(axiosPrivate, game, "Featured 1");
        setFeaturedGames(prev => ([prev[0], game, prev[2], prev[3]]))
    }

    const handleFeature2 = async (game) => {
        patchFeaturedGames(axiosPrivate, game, "Featured 2");
        setFeaturedGames(prev => ([prev[0], prev[1], game, prev[3]]))
    }

    const handleFeature3 = async (game) => {
        patchFeaturedGames(axiosPrivate, game, "Featured 3");
        setFeaturedGames(prev => ([prev[0], prev[1], prev[2], game]))
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section>
            <Users />
            <br />
            <article>
                <h2>Featured Games</h2>
                {featuredGames?.length
                    ? (
                        <ul>
                            {featuredGames.map((game, i) => <li key={i}>{game.name}</li>)}
                        </ul>
                    ) : <p>No Games to Display</p>
                }
            </article>
            <form>
                <TextField label="Game Search" variant="outlined" onChange={(e) => handleFormSubmit(e.target.value)} />
            </form>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 8 }}>
            {searchedGames.map((game, index) => {
                return (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Grid item xs={12}>
                            <Card>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <CardMedia
                                            component="img"
                                            loading="lazy"
                                            height="150"
                                            image={game.image}
                                            alt={game.name}
                                        />
                                    </Grid>
                                    <Grid item xs={7} style={{ backgroundColor: '#535485', color: 'white'}}>
                                        <CardContent>
                                            <Typography gutterBottom variant="h4" component="div" color="white">
                                                {game.name}
                                            </Typography>
                                            <CardActions style={{ justifyContent: 'flex-start', padding: '0px'}}>
                                                <Tooltip title="Game of the Month">
                                                    <EmojiEventsIcon onClick={() => handleGameOTMonth(game)} />
                                                </Tooltip>
                                                <Tooltip title="Featured Game 1">
                                                    <LooksOneIcon onClick={() => handleFeature1(game)} />
                                                </Tooltip>
                                                <Tooltip title="Featured Game 2">
                                                    <LooksTwoIcon onClick={() => handleFeature2(game)} />
                                                </Tooltip>
                                                <Tooltip title="Featured Game 3">
                                                    <Looks3Icon onClick={() => handleFeature3(game)}/>
                                                </Tooltip>
                                            </CardActions>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                )
            })}
            </Grid>
        </section>
    )
}