import { useEffect, useState, Fragment } from 'react';
import { RingLoader } from 'react-spinners';
import useAuth from '../../hooks/useAuth';
import jwt_decode from 'jwt-decode';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';

import getAllFeatured from '../../services/featured/getAllFeatured';
import getCollection from '../../services/collection/getCollection';
import getBacklog from '../../services/backlog/getBacklog';
import getWishlist from '../../services/wishlist/getWishlist';
import toggleBacklog from '../../services/backlog/toggleBacklog';
import toggleWishlist from '../../services/wishlist/toggleWishlist';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { MoreModal } from '../../components/Modal';
//import { RatingModal } from '../../components/RatingModal'
// import { Rating } from '@mui/material';

import './home.css';

export const Home = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

    const username = decoded?.userInfo?.username || '';
    
    const [loading, setLoading] = useState(true);
    const [moreModalOpen, setMoreModalOpen] = useState(false);
    // const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [gameData, setGameData] = useState(0); 
    const [openToastWishlist, setOpenToastWishlist] = useState(false);
    const [openToastBacklog, setOpenToastBacklog] = useState(false);
    const [toggledGame, setToggledGame] = useState('');
    const [toggledStatus, setToggledStatus] = useState('');
    const [gameOTMonth, setGameOTMonth] = useState([]);
    const [featuredGames, setFeaturedGames] = useState([]);
    const [userPS5Games, setUserPS5Games] = useState([]);
    const [userWishlist, setUserWishlist] = useState([]);
    const [userBacklog, setUserBacklog] = useState([]);

    const handleMoreModalOpen = (game) => {
        setGameData(game);
        setMoreModalOpen(true);
    };

    // const handleRatingModalOpen = (game) => {
    //     setGameData(game);
    //     setRatingModalOpen(true);
    // };

    const date = new Date();
    const monthName = date.toLocaleString('default', { month: 'long' });

    const handleMoreModalClose = () => setMoreModalOpen(false);

    // const handleRatingModalClose = () => setRatingModalOpen(false);

    const fetchData = async () => {
        try {
            const response = await getAllFeatured();
            const getFeatured = response.data.map(game => game)
            const gotm = getFeatured[0];
            getFeatured.shift();
            setGameOTMonth(gotm);
            setFeaturedGames(getFeatured);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchUserGames = async () => {
        try {
            const response = await getCollection(axiosPrivate);
            const userGameData = response.map(game => game.gameId)
            setUserPS5Games(userGameData);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchWishlist = async () => {
        try {
            const response = await getWishlist(axiosPrivate);
            const wishlistData = response.map(game => game.gameId)
            setUserWishlist(wishlistData)
        } catch (err) {
            console.error(err);
        }
    }

    const fetchBacklog = async () => {
        try {
            const response = await getBacklog(axiosPrivate);
            const backlogData = response.map(game => game.gameId)
            setUserBacklog(backlogData)
        } catch (err) {
            console.error(err);
        }
    }
    
    const checkWishlist = async (game, status) => {
        setToggledGame(game.name)
        setToggledStatus(status)
        try {
            await toggleWishlist(axiosPrivate, game)
            .then(() => setOpenToastWishlist(true))
        } catch (err) {
            console.error(err);
        }
    }        
    
    const checkBacklog = async (game, status) => {
        setToggledGame(game.name)
        setToggledStatus(status)
        try {
            await toggleBacklog(axiosPrivate, game)
            .then(() => setOpenToastBacklog(true))
        } catch (err) {
            console.error(err);
        }
    }        

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToastWishlist(false);
        setOpenToastBacklog(false);
    };

    useEffect(() => {
        fetchData();
    }, [loading]);

    useEffect(() => {
        fetchUserGames();
        fetchWishlist();
        fetchBacklog();
    }, [openToastWishlist, openToastBacklog])

    return loading ?
        <>
            <RingLoader color="hsla(360, 67%, 53%, 1)" />
        </>
    :
        <>
            <MoreModal open={moreModalOpen} onClose={handleMoreModalClose} game={gameData} />
            {/* <RatingModal open={ratingModalOpen} onClose={handleRatingModalClose} game={gameData}/> */}
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} style={{ padding: '8px' }}>
                <Fragment>
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h4" component="div" style={{ padding: '8px', color: "#C0C0C0", fontFamily: 'psn'}}>Game of the Month</Typography>
                        </div>
                        <Card style={{ margin: '0 20px' }}>
                            <Grid container>
                                <Grid item xs={8.5}>
                                    <CardMedia
                                        component="img"
                                        loading="lazy"
                                        className="myCardMedia"
                                        image={gameOTMonth.image}
                                        alt={gameOTMonth.name}
                                        style={{
                                            objectFit: 'cover',
                                            width: '100%',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3.5} style={{ backgroundColor: '#535485', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h4" component="div" >
                                            {gameOTMonth.name}
                                        </Typography>
                                        <Typography variant="body1" color="white">
                                            Metacritic Score: {gameOTMonth.metacritic}
                                        </Typography>
                                        <Typography variant="body1" color="white">
                                            User Rating Score: {gameOTMonth.rating} / 5
                                        </Typography>
                                        <CardActions style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0px' }} >
                                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                <Tooltip title="See More">
                                                    <MoreHorizIcon onClick={() => handleMoreModalOpen(gameOTMonth.gameId)}/>
                                                </Tooltip>
                                            </div>
                                            {username &&
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    {userPS5Games.includes(gameOTMonth.gameId) &&
                                                        <Tooltip title="Review This Game">
                                                            <StarOutlineIcon />
                                                        </Tooltip>
                                                    }
                                                    {!userPS5Games.includes(gameOTMonth.gameId) && 
                                                        <>
                                                            {userWishlist.includes(gameOTMonth.gameId) 
                                                                ? 
                                                                    <Tooltip title="Remove From Wishlist">
                                                                        <FavoriteIcon onClick={() => checkWishlist(gameOTMonth, 'Removed')}/>
                                                                    </Tooltip>
                                                                :
                                                                    <Tooltip title="Add To Wishlist">
                                                                        <FavoriteBorderIcon onClick={() => checkWishlist(gameOTMonth, 'Added')}/>
                                                                    </Tooltip>
                                                            }
                                                            {userBacklog.includes(gameOTMonth.gameId) 
                                                                ? 
                                                                    <Tooltip title="Remove From Backlog">
                                                                        <PlaylistRemoveIcon onClick={() => checkBacklog(gameOTMonth, 'Removed')}/>
                                                                    </Tooltip>
                                                                :
                                                                    <Tooltip title="Add To Backlog">
                                                                        <PlaylistAddIcon onClick={() => checkBacklog(gameOTMonth, 'Added')}/>
                                                                    </Tooltip>
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            }
                                        </CardActions>      
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Fragment>
                <Container maxWidth={false}>
                    <Box sx={{ width: 1, marginTop:2}}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography variant="h4" component="div" style={{ padding: '8px', color: "#C0C0C0", fontFamily: 'psn'}}>PS+ Games {monthName}</Typography>
                        </div>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} style={{ padding: '0 0 0 18px' }}>
                        {featuredGames.map((game, index) => {
                            return (
                                <Grid key={index} item xs={2} sm={4} md={4}>
                                    <Card style={{ backgroundColor: '#535485', color: 'white' }}>
                                        <CardMedia
                                            component="img"
                                            loading="lazy"
                                            height="300"
                                            image={game.image}
                                            alt={game.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div" color="white">
                                                {game.name}
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                                Metacritic Score: {game.metacritic}
                                            </Typography>
                                            <Typography variant="body2" color="white">
                                                User Rating Score: {game.rating} / 4
                                            </Typography>
                                        </CardContent>
                                        <CardActions style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0px' }} >
                                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                                <Tooltip title="See More">
                                                    <MoreHorizIcon onClick={() => handleMoreModalOpen(game.gameId)}/>
                                                </Tooltip>
                                            </div>
                                            {username &&
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                    {userPS5Games.includes(game.gameId) &&
                                                        <Tooltip title="Review This Game">
                                                            <StarOutlineIcon />
                                                        </Tooltip>
                                                    }
                                                    {!userPS5Games.includes(game.gameId) &&
                                                        <>
                                                            {userWishlist.includes(game.gameId) 
                                                                ? 
                                                                    <Tooltip title="Remove From Wishlist">
                                                                        <FavoriteIcon onClick={() => checkWishlist(game, 'Removed')}/>
                                                                    </Tooltip>
                                                                :
                                                                    <Tooltip title="Add To Wishlist">
                                                                        <FavoriteBorderIcon onClick={() => checkWishlist(game, 'Added')}/>
                                                                    </Tooltip>
                                                            }
                                                            {userBacklog.includes(game.gameId) 
                                                                ? 
                                                                    <Tooltip title="Remove From Backlog">
                                                                        <PlaylistRemoveIcon onClick={() => checkBacklog(game, 'Removed')}/>
                                                                    </Tooltip>
                                                                :
                                                                    <Tooltip title="Add To Backlog">
                                                                        <PlaylistAddIcon onClick={() => checkBacklog(game, 'Added')}/>
                                                                    </Tooltip>
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            }
                                        </CardActions>
                                    </Card>
                                </Grid>
                            )
                        })}
                        </Grid>
                    </Box>
                </Container>
                <Snackbar open={openToastWishlist} autoHideDuration={2500} onClose={handleCloseToast}>
                    {toggledStatus == 'Added' ?
                        <Alert
                            onClose={handleCloseToast}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {toggledGame} Added To Wishlist
                        </Alert>
                    :
                        <Alert
                            onClose={handleCloseToast}
                            severity="error"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {toggledGame} Removed From Wishlist
                        </Alert>
                    }
                </Snackbar>
                <Snackbar open={openToastBacklog} autoHideDuration={2500} onClose={handleCloseToast}>
                    {toggledStatus == 'Added' ?
                        <Alert
                            onClose={handleCloseToast}
                            severity="success"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {toggledGame} Added To Backlog
                        </Alert>
                    :
                        <Alert
                            onClose={handleCloseToast}
                            severity="error"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {toggledGame} Removed From Backlog
                        </Alert>
                    }
                </Snackbar>
            </Grid>
        </>
}