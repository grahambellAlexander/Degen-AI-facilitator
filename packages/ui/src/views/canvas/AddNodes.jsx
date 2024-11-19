import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

// material-ui
import { useTheme } from '@mui/material/styles'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    ClickAwayListener,
    Divider,
    InputAdornment,
    List,
    ListItemButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    OutlinedInput,
    Paper,
    Popper,
    Stack,
    Typography,
    Chip,
    Tab,
    Tabs
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar'

// project imports
import MainCard from '@/ui-component/cards/MainCard'
import Transitions from '@/ui-component/extended/Transitions'
import { StyledFab } from '@/ui-component/button/StyledFab'

// icons
import { IconPlus, IconSearch, IconMinus, IconX } from '@tabler/icons-react'
import LlamaindexPNG from '@/assets/images/llamaindex.png'
import LangChainPNG from '@/assets/images/langchain.png'
import utilNodesPNG from '@/assets/images/utilNodes.png'

// const
import { baseURL } from '@/store/constant'
import { SET_COMPONENT_NODES } from '@/store/actions'
import { Margin } from '@mui/icons-material'
import { BorderRight } from '@mui/icons-material'

// ==============================|| ADD NODES||============================== //
function a11yProps(index) {
    return {
        id: `attachment-tab-${index}`,
        'aria-controls': `attachment-tabpanel-${index}`
    }
}

const blacklistCategoriesForAgentCanvas = ['Agents', 'Memory', 'Record Manager']
const allowedAgentModel = {}
const exceptions = {
    Memory: ['agentMemory']
}

const AddNodes = ({ nodesData, node, isAgentCanvas }) => {
    const theme = useTheme()
    const customization = useSelector((state) => state.customization)
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState('')
    const [nodes, setNodes] = useState({})
    const [open, setOpen] = useState(true)
    const [categoryExpanded, setCategoryExpanded] = useState({})
    const [tabValue, setTabValue] = useState(0)

    const anchorRef = useRef(null)
    const prevOpen = useRef(open)
    const ps = useRef()

    const scrollTop = () => {
        const curr = ps.current
        if (curr) {
            curr.scrollTop = 0
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
        filterSearch(searchValue, newValue)
    }

    const addException = () => {
        let nodes = []
        for (const category in exceptions) {
            const nodeNames = exceptions[category]
            nodes.push(...nodesData.filter((nd) => nd.category === category && nodeNames.includes(nd.name)))
        }
        return nodes
    }

    const getSearchedNodes = (value) => {
        if (isAgentCanvas) {
            const nodes = nodesData.filter((nd) => !blacklistCategoriesForAgentCanvas.includes(nd.category))
            nodes.push(...addException())
            const passed = nodes.filter((nd) => {
                const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
                const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
                const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
                return passesName || passesCategory || passesLabel
            })
            return passed
        }
        const nodes = nodesData.filter((nd) => nd.category !== 'Multi Agents' && nd.category !== 'Sequential Agents')
        const passed = nodes.filter((nd) => {
            const passesName = nd.name.toLowerCase().includes(value.toLowerCase())
            const passesLabel = nd.label.toLowerCase().includes(value.toLowerCase())
            const passesCategory = nd.category.toLowerCase().includes(value.toLowerCase())
            return passesName || passesCategory || passesLabel
        })
        return passed
    }

    const filterSearch = (value, newTabValue) => {
        setSearchValue(value)
        setTimeout(() => {
            if (value) {
                const returnData = getSearchedNodes(value)
                groupByCategory(returnData, newTabValue ?? tabValue, true)
                scrollTop()
            } else if (value === '') {
                groupByCategory(nodesData, newTabValue ?? tabValue)
                scrollTop()
            }
        }, 500)
    }

    const groupByTags = (nodes, newTabValue = 0) => {
        const langchainNodes = nodes.filter((nd) => !nd.tags)
        const llmaindexNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('LlamaIndex'))
        const utilitiesNodes = nodes.filter((nd) => nd.tags && nd.tags.includes('Utilities'))
        if (newTabValue === 0) {
            return langchainNodes
        } else if (newTabValue === 1) {
            return llmaindexNodes
        } else {
            return utilitiesNodes
        }
    }

    const groupByCategory = (nodes, newTabValue, isFilter) => {
        if (isAgentCanvas) {
            const accordianCategories = {}
            const result = nodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                // Filter out blacklisted categories
                if (!blacklistCategoriesForAgentCanvas.includes(category)) {
                    // Filter out LlamaIndex nodes
                    const nodes = result[category].filter((nd) => !nd.tags || !nd.tags.includes('LlamaIndex'))
                    if (!nodes.length) continue

                    // Only allow specific models for specific categories
                    if (Object.keys(allowedAgentModel).includes(category)) {
                        const allowedModels = allowedAgentModel[category]
                        filteredResult[category] = nodes.filter((nd) => allowedModels.includes(nd.name))
                    } else {
                        filteredResult[category] = nodes
                    }
                }

                // Allow exceptions
                if (Object.keys(exceptions).includes(category)) {
                    filteredResult[category] = addException()
                }
            }
            setNodes(filteredResult)
            accordianCategories['Multi Agents'] = true
            accordianCategories['Sequential Agents'] = true
            accordianCategories['Memory'] = true
            setCategoryExpanded(accordianCategories)
        } else {
            const taggedNodes = groupByTags(nodes, newTabValue)
            const accordianCategories = {}
            const result = taggedNodes.reduce(function (r, a) {
                r[a.category] = r[a.category] || []
                r[a.category].push(a)
                accordianCategories[a.category] = isFilter ? true : false
                return r
            }, Object.create(null))

            const filteredResult = {}
            for (const category in result) {
                if (category === 'Multi Agents' || category === 'Sequential Agents') {
                    continue
                }
                filteredResult[category] = result[category]
            }
            setNodes(filteredResult)
            setCategoryExpanded(accordianCategories)
        }
    }

    const handleAccordionChange = (category) => (event, isExpanded) => {
        const accordianCategories = { ...categoryExpanded }
        accordianCategories[category] = isExpanded
        setCategoryExpanded(accordianCategories)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const onDragStart = (event, node) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(node))
        event.dataTransfer.effectAllowed = 'move'
    }

    const getImage = (tabValue) => {
        if (tabValue === 0) {
            return LangChainPNG
        } else if (tabValue === 1) {
            return LlamaindexPNG
        } else {
            return utilNodesPNG
        }
    }
    useEffect(() => {
        if (nodesData) {
            groupByCategory(nodesData)
            dispatch({ type: SET_COMPONENT_NODES, componentNodes: nodesData })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodesData, dispatch])

    return (
        <>
            <Popper
                placement='bottom-end'
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [-40, 70]
                            }
                        }
                    ]
                }}
                sx={{ zIndex: 1000 }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener>
                                <MainCard
                                    content={true}
                                    sx={{ pt: 8, height: '100vh', width: '275px', borderRight: '1px solid #ccc', borderRadius: '0px' }}
                                >
                                    <Box>
                                        <OutlinedInput
                                            // eslint-disable-next-line
                                            autoFocus
                                            sx={{
                                                width: '100%',
                                                height: '32px',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '6px !important'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#000000',
                                                    borderWidth: '1px'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#000000'
                                                },
                                                '& fieldset': {
                                                    borderRadius: '6px !important'
                                                }
                                            }}
                                            id='input-search-node'
                                            value={searchValue}
                                            onChange={(e) => filterSearch(e.target.value)}
                                            placeholder='Search nodes'
                                            startAdornment={
                                                <InputAdornment position='start'>
                                                    <IconSearch stroke={1.5} size='1rem' color={'#D1D5DB'} />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment
                                                    position='end'
                                                    sx={{
                                                        cursor: 'pointer',
                                                        color: '#D1D5DB',
                                                        '&:hover': {
                                                            color: theme.palette.grey[900]
                                                        }
                                                    }}
                                                    title='Clear Search'
                                                >
                                                    <IconX
                                                        stroke={1.5}
                                                        size='1rem'
                                                        onClick={() => filterSearch('')}
                                                        style={{
                                                            cursor: 'pointer'
                                                        }}
                                                    />
                                                </InputAdornment>
                                            }
                                            aria-describedby='search-helper-text'
                                            inputProps={{
                                                'aria-label': 'weight'
                                            }}
                                        />
                                    </Box>
                                    <PerfectScrollbar
                                        containerRef={(el) => {
                                            ps.current = el
                                        }}
                                        style={{
                                            maxHeight: '100vh',
                                            overflowX: 'hidden'
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                border: 'none !important'
                                            }}
                                        >
                                            <List
                                                sx={{
                                                    border: 'none !important'
                                                }}
                                            >
                                                {Object.keys(nodes)
                                                    .sort()
                                                    .map((category) => (
                                                        <Accordion
                                                            className='no-padding'
                                                            expanded={categoryExpanded[category] || false}
                                                            onChange={handleAccordionChange(category)}
                                                            key={category}
                                                            disableGutters
                                                            sx={{
                                                                '&:before': {
                                                                    display: 'none' 
                                                                }
                                                            }}
                                                        >
                                                            <AccordionSummary
                                                                className='no-padding'
                                                                expandIcon={<ChevronRightIcon />}
                                                                sx={{
                                                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                                                        color: '#000000'
                                                                    },
                                                                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                                                                        transform: 'rotate(90deg)'
                                                                    },
                                                                    height: '32px',
                                                                    minHeight: '32px',
                                                                    border: 'none !important'
                                                                }}
                                                                aria-controls={`nodes-accordian-${category}`}
                                                                id={`nodes-accordian-header-${category}`}
                                                            >
                                                                <Typography
                                                                    variant='h5'
                                                                    sx={{
                                                                        fontWeight: 300
                                                                    }}
                                                                >
                                                                    {category}
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails className='no-padding'>
                                                                {nodes[category].map((node, index) => (
                                                                    <div
                                                                        key={node.name}
                                                                        onDragStart={(event) => onDragStart(event, node)}
                                                                        draggable
                                                                    >
                                                                        <ListItemButton
                                                                            sx={{
                                                                                p: 0,
                                                                                borderRadius: `${customization.borderRadius}px`,
                                                                                cursor: 'move',
                                                                                border: 'none'
                                                                            }}
                                                                        >
                                                                            <ListItem alignItems='center' sx={{ borderBottom: 'none' }}>
                                                                                <ListItemAvatar>
                                                                                    <div
                                                                                        style={{
                                                                                            width: 24,
                                                                                            height: 24,
                                                                                            borderRadius: '50%',
                                                                                            backgroundColor: 'white'
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            style={{
                                                                                                width: '100%',
                                                                                                height: '100%',
                                                                                                objectFit: 'contain'
                                                                                            }}
                                                                                            alt={node.name}
                                                                                            src={`${baseURL}/api/v1/node-icon/${node.name}`}
                                                                                        />
                                                                                    </div>
                                                                                </ListItemAvatar>
                                                                                <ListItemText
                                                                                    sx={{ ml: 1 }}
                                                                                    primary={
                                                                                        <>
                                                                                            <div
                                                                                                style={{
                                                                                                    display: 'flex',
                                                                                                    flexDirection: 'row',
                                                                                                    alignItems: 'center'
                                                                                                }}
                                                                                            >
                                                                                                <span>{node.label}</span>

                                                                                                {node.badge && (
                                                                                                    <Chip
                                                                                                        sx={{
                                                                                                            width: 'max-content',
                                                                                                            fontWeight: 700,
                                                                                                            fontSize: '0.65rem',
                                                                                                            background:
                                                                                                                node.badge === 'DEPRECATING'
                                                                                                                    ? theme.palette.warning
                                                                                                                          .main
                                                                                                                    : theme.palette.teal
                                                                                                                          .main,
                                                                                                            color:
                                                                                                                node.badge !== 'DEPRECATING'
                                                                                                                    ? 'white'
                                                                                                                    : 'inherit'
                                                                                                        }}
                                                                                                        size='small'
                                                                                                        label={node.badge}
                                                                                                    />
                                                                                                )}
                                                                                            </div>
                                                                                        </>
                                                                                    }
                                                                                />
                                                                            </ListItem>
                                                                        </ListItemButton>
                                                                    </div>
                                                                ))}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    )
}

AddNodes.propTypes = {
    nodesData: PropTypes.array,
    node: PropTypes.object,
    isAgentCanvas: PropTypes.bool
}

export default AddNodes
