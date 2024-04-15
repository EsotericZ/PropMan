import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import jwt_decode from 'jwt-decode';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import getPSNUserFriends from '../../services/psn/getPSNUserFriends';
import getUserData from '../../services/profile/getUserData';
import getCollection from '../../services/collection/getCollection';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import updateVerifyCode from '../../services/profile/updateVerifyCode';
import { GOTYCard } from '../../components/GOTYCard';
import { ProfileCard } from '../../components/ProfileCard';

export const Profile = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

    const username = decoded?.userInfo?.username || '';
    const psn = decoded?.userInfo?.psn || '';

    const [userData, setUserData] = useState({});
    const [userGOTYData, setUserGOTYData] = useState([]);
    const [userPS5Games, setUserPS5Games] = useState([]);
    const [userPS5GamesCount, setUserPS5GamesCount] = useState(0);
    const [userPlatsCount, setUserPlatsCount] = useState(0);
    const [user100Count, setUser100Count] = useState(0);
    const [userAverage, setUserAverage] = useState(0);
    const [userReviewCount, setUserReviewCount] = useState(0);

    const fetchUserData = async () => {
        try {
            const response = await getUserData(axiosPrivate);
            setUserData(response);
            setUserGOTYData(response.goty);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchUserGames = async () => {
        try {
            const response = await getCollection(axiosPrivate);
            console.log(response);
            setUserPS5Games(response);
            setUserPS5GamesCount(response.length)

            const platCount = response.reduce((acc, item) => {
                if (item.platinum == 1) {
                    return acc + 1;
                }
                return acc;
            }, 0)
            
            const hundredCount = response.reduce((acc, item) => {
                if (item.progress == 100) {
                    return acc + 1;
                }
                return acc;
            }, 0)

            const totalPercent = response.reduce((acc, item) => acc + item.progress, 0)
            const averagePercent = totalPercent / response.length;

            const reviewCount = response.reduce((acc, item) => {
                if (item.userRating) {
                    return acc + 1;
                }
                return acc;
            }, 0)

            setUserPlatsCount(platCount)
            setUser100Count(hundredCount)
            setUserAverage(averagePercent)
            setUserReviewCount(reviewCount)
        } catch (err) {
            console.log(err);
        }
    }

    const fetchUserFriends = async () => {
        if (psn) {
            try {
                const response = await getPSNUserFriends(axiosPrivate, psn);
                console.log(response);
            } catch (error) {
                console.error('Error fetching user friends:', error);
            }
        }
    }

    const verifyPSN = async () => {
        try {
            await updateVerifyCode(axiosPrivate)
            fetchUserData();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUserData()
    }, []);

    useEffect(() => {
        fetchUserGames()
    }, []);

    return (
        <>
            {userData.verified &&
                <Grid container justifyContent="center">
                    <ProfileCard 
                        userPS5GamesCount={userPS5GamesCount}
                        userPlatsCount={userPlatsCount}
                        user100Count={user100Count}
                        userAverage={userAverage}
                        userReviewCount={userReviewCount}
                    />
                    <Grid item xs={4}>
                        <Typography className='titleBlocks'>
                            Stats
                        </Typography>
                        <h1>{psn}</h1>
                        <h1>Account Verified</h1>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className='titleBlocks'>
                            GoTY
                        </Typography>
                        {userGOTYData && userGOTYData.map((game, index) => {
                            return (
                                <GOTYCard game={game} key={index} />
                            )
                        })}
                    </Grid>
                    <Grid item xs={4}>
                        <Typography className='titleBlocks'>
                            Friends
                        </Typography>
                        <Button onClick={fetchUserFriends}>
                            DO NO CLICK THIS BUTTON
                        </Button>
                    </Grid>
                </Grid>
            }

            {(!userData.verified && userData.verifyCode) &&
                <>
                    <h1>Send the code '{userData.verifyCode}' to PSN account PZAPRV</h1>
                    <h1>The code must be send from {psn}</h1>
                    <h1>Approval proccess may take up to 48 hours</h1>
                </>
            }

            {(!userData.verified && !userData.verifyCode) &&
                <Button variant="outlined" onClick={verifyPSN} disable>
                    Verify PSN
                </Button>
            }
        </>
    )
}