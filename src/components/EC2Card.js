import React, { useState } from "react";
import { Card, CardContent, Typography, Box, LinearProgress, Button, Alert, Collapse, Chip, IconButton } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Line } from "react-chartjs-2";

function EC2Card({ instance, cpu, cpuTrend, networkTrend, cost, aiSuggestion, tags, volumes, enis, onOptimize, onTerminate, onExport, loading }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = instance.state === "running" ? "#00e676" : instance.state === "stopped" ? "#ff1744" : "#ffd600";
  const isIdle = cpu < 5;
  const isOverutilized = cpu > 80;

  return (
    <Card className="rounded-2xl shadow-xl hover:shadow-2xl transition-shadow mb-4">
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <CloudIcon sx={{ color: statusColor, mr: 1 }} />
          <Typography variant="h6" fontWeight={700} mr={2}>{instance.name || instance.id}</Typography>
          <Chip label={instance.type} size="small" sx={{ ml: 1 }} />
          <Chip label={instance.state} size="small" sx={{ ml: 1, bgcolor: statusColor, color: "#fff" }} />
          <MonetizationOnIcon sx={{ color: "#ffd600", ml: 2 }} />
          <Typography variant="body2" fontWeight={600}>${cost}/day</Typography>
          {isIdle && <Chip label="Idle" color="info" sx={{ ml: 2 }} />}
          {isOverutilized && <Chip label="Overutilized" color="error" sx={{ ml: 2 }} />}
          <Button size="small" onClick={onExport} sx={{ ml: "auto" }}>Export</Button>
          <IconButton onClick={() => setExpanded(!expanded)}><ExpandMoreIcon /></IconButton>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body2" mr={1}>CPU:</Typography>
          <Box width={120} mr={1}>
            <LinearProgress variant="determinate" value={cpu} sx={{ height: 10, borderRadius: 5, background: "#e3e3e3", '& .MuiLinearProgress-bar': { backgroundColor: statusColor } }} />
          </Box>
          <Typography variant="body2" fontWeight={600}>{cpu?.toFixed(2)}%</Typography>
        </Box>
        <Collapse in={expanded}>
          <Box mb={2}>
            <Typography variant="subtitle2">CPU Trend</Typography>
            <Line data={cpuTrend} height={60} />
            <Typography variant="subtitle2" mt={2}>Network Trend</Typography>
            <Line data={networkTrend} height={60} />
            {/* Add cost trend, warnings, etc. */}
            <Typography variant="subtitle2" mt={2}>Tags</Typography>
            {tags && tags.map(tag => <Chip key={tag.Key} label={`${tag.Key}: ${tag.Value}`} sx={{ mr: 1, mb: 1 }} />)}
            <Typography variant="subtitle2" mt={2}>Volumes</Typography>
            {volumes && volumes.map(vol => <Chip key={vol} label={vol} sx={{ mr: 1, mb: 1 }} />)}
            <Typography variant="subtitle2" mt={2}>ENIs</Typography>
            {enis && enis.map(eni => <Chip key={eni} label={eni} sx={{ mr: 1, mb: 1 }} />)}
          </Box>
        </Collapse>
        <Box display="flex" gap={2} mb={2}>
          <Button variant="outlined" onClick={onOptimize} disabled={loading}>Optimize</Button>
          <Button variant="contained" color="error" onClick={onTerminate} disabled={loading}>Terminate</Button>
        </Box>
        {aiSuggestion && <Alert severity="info">{aiSuggestion}</Alert>}
      </CardContent>
    </Card>
  );
}

export default EC2Card; 