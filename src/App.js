import React, { useEffect, useState } from "react";
import {
  Container, Typography, Paper, List, ListItem, ListItemText, Button, Box, Alert, Drawer, AppBar, Toolbar, CssBaseline, Divider, IconButton, ListItemIcon
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudIcon from "@mui/icons-material/Cloud";
import MemoryIcon from "@mui/icons-material/Memory";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EC2Card from "./components/EC2Card";

const drawerWidth = 320;

function App() {
  const [instances, setInstances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [bill, setBill] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");

  useEffect(() => {
    fetchInstances();
    fetchBill();
  }, []);

  const fetchInstances = async () => {
    const res = await fetch("http://localhost:8000/aws/instances");
    const data = await res.json();
    setInstances(data);
    if (data.length > 0) {
      setSelected(data[0]);
      fetchAllForInstance(data[0].id);
    }
  };

  const fetchBill = async () => {
    const res = await fetch("http://localhost:8000/aws/billing");
    const data = await res.json();
    setBill(data.bill);
  };

  const fetchAllForInstance = async (instanceId) => {
    setLoading(true);
    try {
      const metricsRes = await fetch(`http://localhost:8000/aws/metrics?instance_id=${instanceId}`);
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);
      const alertsRes = await fetch(`http://localhost:8000/aws/alerts?instance_id=${instanceId}`);
      const alertsData = await alertsRes.json();
      setAlerts(alertsData.alerts);
      // Dummy AI suggestion (replace with Gemini API if needed)
      setAiSuggestion(
        metricsData.CPUUtilization > 80
          ? "AI Suggestion: High CPU detected! Consider resizing your instance."
          : "AI Suggestion: All resources are healthy."
      );
    } catch (err) {
      setAlerts(["Error fetching AWS data."]);
    }
    setLoading(false);
  };

  const handleTerminate = async () => {
    if (!selected) return;
    if (!window.confirm(`Are you sure you want to terminate instance ${selected.id}?`)) return;
    setLoading(true);
    try {
      await fetch("http://localhost:8000/aws/terminate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instance_id: selected.id })
      });
      setAiSuggestion("Instance terminated. Please refresh the list.");
      fetchInstances();
    } catch (err) {
      setAiSuggestion("Error terminating instance.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1300, bgcolor: "#1a237e" }}>
        <Toolbar>
          <CloudIcon sx={{ mr: 2, color: "#fff" }} />
          <Typography variant="h5" sx={{ flexGrow: 1, color: "#fff" }}>
            AWS Gemini Monitoring Dashboard
          </Typography>
          <MonetizationOnIcon sx={{ color: "#ffd600", mr: 1 }} />
          <Typography variant="h6" sx={{ color: "#ffd600" }}>
            ${bill ? bill.toFixed(2) : "..."}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: "#232946", color: "#fff" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#ffd600" }}>
            EC2 Instances
          </Typography>
          <List>
            {instances.map((inst) => (
              <ListItem
                button
                key={inst.id}
                selected={selected && selected.id === inst.id}
                onClick={() => {
                  setSelected(inst);
                  fetchAllForInstance(inst.id);
                }}
                sx={{ borderRadius: 2, mb: 1, bgcolor: selected && selected.id === inst.id ? "#393e46" : "inherit" }}
              >
                <ListItemIcon>
                  <MemoryIcon sx={{ color: inst.state === "running" ? "#00e676" : "#ff1744" }} />
                </ListItemIcon>
                <ListItemText
                  primary={inst.id}
                  secondary={`Type: ${inst.type} | State: ${inst.state}`}
                  primaryTypographyProps={{ fontWeight: 600, color: "#fff" }}
                  secondaryTypographyProps={{ color: "#bdbdbd" }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Container maxWidth="md">
          <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mt: 2 }}>
            {selected && (
              <>
                <Typography variant="h5" sx={{ mb: 2, color: "#1a237e" }}>
                  Instance: {selected.id}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Type: {selected.type} | State: {selected.state} | Launch: {selected.launch_time}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleTerminate}
                  disabled={loading || selected.state !== "running"}
                  sx={{ mb: 2 }}
                >
                  Terminate Instance
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => fetchAllForInstance(selected.id)}
                  disabled={loading}
                  sx={{ mb: 2, ml: 2 }}
                >
                  Refresh Metrics
                </Button>
                {alerts.length > 0 && alerts.map((alert, idx) => (
                  <Alert severity="warning" key={idx} sx={{ mb: 1 }}>{alert}</Alert>
                ))}
                {metrics && (
                  <>
                    <Typography variant="h6" sx={{ mt: 2 }}>EC2 Metrics:</Typography>
                    <List>
                      {Object.entries(metrics).map(([key, value]) => (
                        <ListItem key={key}>
                          <ListItemText primary={`${key}: ${value.toFixed(2)}`} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                <Alert severity="info" sx={{ mt: 2, fontWeight: 600 }}>
                  {aiSuggestion}
                </Alert>
              </>
            )}
            {!selected && <Typography>Select an instance to view details.</Typography>}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default App; 