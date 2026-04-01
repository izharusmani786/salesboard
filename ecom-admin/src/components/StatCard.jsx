// components/StatCard.jsx
import { Card, CardContent, Typography } from "@mui/material";

export default function StatCard() {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2">Total Sales</Typography>
        <Typography variant="h5">$500,000</Typography>
      </CardContent>
    </Card>
  );
}