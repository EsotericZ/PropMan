import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import getAllUsers from "../../services/admin/getAllUsers";
import updateVerifyUser from "../../services/admin/updateVerifyUser";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead } from "@mui/material";

import HowToRegIcon from '@mui/icons-material/HowToReg';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
    },
}));
  
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export const Users = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getUsers = async () => {
            try {
                const response = await getAllUsers(axiosPrivate);
                setUsers(response.data)
            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
        getUsers();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    const toggleVerified = async (row) => {
        try {
            await updateVerifyUser(axiosPrivate, row.username)
            const response = await getAllUsers(axiosPrivate);
            setUsers(response.data);
        } catch (err) {
            console.error(err);
        }
    }
  
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TableContainer component={Paper} sx={{ width: '95%' }}>
                <Table sx={{ minWidth: 500 }} stickyHeader>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">Username</StyledTableCell>
                            <StyledTableCell align="center">PSN</StyledTableCell>
                            <StyledTableCell align="center">Verified</StyledTableCell>
                            <StyledTableCell align="center">Code</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {(rowsPerPage > 0
                        ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : users
                    ).map((row, index) => (
                        <StyledTableRow key={index} align="center">
                            <StyledTableCell component="th" scope="row" style={{ width: '30%' }} align="center">
                                {row.username}
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '30%' }} align="center">
                                {row.psn}
                            </StyledTableCell>
                            <StyledTableCell style={{ width: '20%' }} align="center">
                                {row.verified && <HowToRegIcon />}
                            </StyledTableCell>
                            {!row.verified && row.verifyCode ?
                                <StyledTableCell style={{ width: '20%' }} align="center" onClick={() => toggleVerified(row)}>
                                    {!row.verified && row.verifyCode}
                                </StyledTableCell>
                            :
                                <StyledTableCell style={{ width: '20%' }} align="center">
                                    {!row.verified && row.verifyCode}
                                </StyledTableCell>
                            }
                        </StyledTableRow>
                    ))}
                    {emptyRows > 0 && (
                        <StyledTableRow style={{ height: 53 * emptyRows }}>
                            <StyledTableCell colSpan={4} />
                        </StyledTableRow>
                    )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={4}
                                count={users.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                    'aria-label': 'rows per page',
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
};