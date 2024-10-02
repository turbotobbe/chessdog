import { Box, Typography, SxProps, Tabs, Tab, TextField } from "@mui/material";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      sx={{ height: "100%", width: "100%" }} // Make sure it takes full space
    >
      {value === index && <Typography component="div">{children}</Typography>}
    </Box>
  );
};

const AnalysisSourceComponent: React.FC<{ sx?: SxProps }> = ({ sx }) => {
    // State to manage active tab
    const [activeTab, setActiveTab] = React.useState(0);

    // Function to handle tab change
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        // <Box
        //   sx={{
        //     height: "var(--my-box-height)",
        //     display: "flex",
        //     flexDirection: "column",
        //   }}
        // >
        <Box sx={sx}    >
            <Tabs value={activeTab} onChange={handleChange}>
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
            </Tabs>

            <Box sx={{ flexGrow: 1 }}>
                {activeTab === 0 && (
                    <TabPanel value={activeTab} index={0}>
                        <Box
                            component="form"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                height: "100%", // Full height of the parent container
                                marginTop: 2,
                            }}
                        >
                            {/* 1st Row: Single line text input */}
                            <TextField
                                className="analysis-source-pgn-url"
                                label="URL"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                            />

                            {/* 2nd Row: Multiline text input, takes up remaining space */}
                            <TextField
                                className="analysis-source-pgn-text"
                                label="Text"
                                variant="outlined"
                                multiline
                                rows={20}
                                fullWidth
                            />

                        </Box>
                    </TabPanel>
                )}
                {activeTab === 1 && <TabPanel value={activeTab} index={1}>Tab 2 content</TabPanel>}
            </Box>
        </Box>
        // </Box>
    );
};

export default AnalysisSourceComponent;
