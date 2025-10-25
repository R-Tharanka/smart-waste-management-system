/**
 * Report Filters Component
 * 
 * Handles the filter form for report generation.
 * Follows the Single Responsibility Principle - only manages filter UI.
 * 
 * @component
 */

import { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { SlidersHorizontal, BarChart3 } from 'lucide-react';

/**
 * Section visibility switches configuration
 */
const SECTION_SWITCHES = [
  { key: 'households', label: 'Household table' },
  { key: 'regions', label: 'Region breakdown' },
  { key: 'wasteTypes', label: 'Waste composition' },
  { key: 'timeline', label: 'Trend timeline' },
];

/**
 * ReportFilters Component
 * 
 * @param {Object} props
 * @param {Object} props.config - Configuration object with filter options
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {Object} props.visibility - Section visibility state
 * @param {Function} props.onVisibilityToggle - Callback when visibility toggles
 * @param {Function} props.onSubmit - Callback when form is submitted
 * @param {Boolean} props.loading - Whether report is being generated
 * @param {Boolean} props.loadingConfig - Whether config is being loaded
 */
function ReportFilters({
  config,
  filters,
  onFilterChange,
  visibility,
  onVisibilityToggle,
  onSubmit,
  loading,
  loadingConfig,
}) {
  /**
   * Handles input change events
   */
  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      onFilterChange(name, value);
    },
    [onFilterChange]
  );

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <Card className="rounded-3xl border border-slate-200/80 shadow-sm">
      <CardHeader
        title="Report criteria"
        subheader="Select the dimensions that matter to your analysis."
        action={
          <Stack direction="row" spacing={2} alignItems="center">
            <SlidersHorizontal size={18} className="text-slate-400" />
          </Stack>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        {loadingConfig ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={22} />
            <Typography variant="body2" color="text.secondary">
              Loading configuration…
            </Typography>
          </Stack>
        ) : (
          <Stack
            component="form"
            spacing={4}
            onSubmit={handleSubmit}
            alignItems="center"
            sx={{ width: '100%' }}
          >
            {/* Filter inputs */}
            <Grid container spacing={3} justifyContent="center" sx={{ width: '100%' }}>
              {/* Date range inputs */}
              <Grid item xs={12} md={3} sx={{ maxWidth: 260, width: '100%' }}>
                <TextField
                  label="From"
                  name="from"
                  type="date"
                  value={filters.from || ''}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={3} sx={{ maxWidth: 260, width: '100%' }}>
                <TextField
                  label="To"
                  name="to"
                  type="date"
                  value={filters.to || ''}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Regions filter */}
              <Grid item xs={12} md={6} sx={{ maxWidth: 560, width: '100%' }}>
                <FormControl fullWidth sx={{ minWidth: 160 }}>
                  <InputLabel id="regions-label">Regions</InputLabel>
                  <Select
                    labelId="regions-label"
                    label="Regions"
                    name="regions"
                    multiple
                    value={filters.regions || []}
                    onChange={handleChange}
                    renderValue={(selected) => (selected && selected.length ? selected.join(', ') : 'All regions')}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {(config?.regions || []).map((region) => (
                      <MenuItem key={region} value={region}>
                        {region}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Waste types filter */}
              <Grid item xs={12} md={6} sx={{ maxWidth: 560, width: '100%' }}>
                <FormControl fullWidth sx={{ minWidth: 160 }}>
                  <InputLabel id="wasteTypes-label">Waste type</InputLabel>
                  <Select
                    labelId="wasteTypes-label"
                    label="Waste type"
                    name="wasteTypes"
                    multiple
                    value={filters.wasteTypes || []}
                    onChange={handleChange}
                    renderValue={(selected) => (selected && selected.length ? selected.join(', ') : 'All types')}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {(config?.wasteTypes || []).map((wasteType) => (
                      <MenuItem key={wasteType} value={wasteType}>
                        {wasteType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Billing models filter */}
              <Grid item xs={12} md={6} sx={{ maxWidth: 560, width: '100%' }}>
                <FormControl fullWidth sx={{ minWidth: 160 }}>
                  <InputLabel id="billingModels-label">Billing model</InputLabel>
                  <Select
                    labelId="billingModels-label"
                    label="Billing model"
                    name="billingModels"
                    multiple
                    value={filters.billingModels || []}
                    onChange={handleChange}
                    renderValue={(selected) => (selected && selected.length ? selected.join(', ') : 'All models')}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {(config?.billingModels || []).map((model) => (
                      <MenuItem key={model} value={model}>
                        {model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Submit button and visibility toggles */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} /> : <BarChart3 size={18} />}
              >
                {loading ? 'Crunching numbers…' : 'Generate report'}
              </Button>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Show sections:
                </Typography>
                {SECTION_SWITCHES.map((item) => (
                  <FormControlLabel
                    key={item.key}
                    control={
                      <Switch
                        checked={visibility[item.key]}
                        onChange={() => onVisibilityToggle(item.key)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                    }
                    sx={{ mr: 0 }}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

ReportFilters.propTypes = {
  config: PropTypes.shape({
    regions: PropTypes.arrayOf(PropTypes.string),
    wasteTypes: PropTypes.arrayOf(PropTypes.string),
    billingModels: PropTypes.arrayOf(PropTypes.string),
  }),
  filters: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
    regions: PropTypes.arrayOf(PropTypes.string),
    wasteTypes: PropTypes.arrayOf(PropTypes.string),
    billingModels: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  visibility: PropTypes.object.isRequired,
  onVisibilityToggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  loadingConfig: PropTypes.bool,
};

ReportFilters.defaultProps = {
  config: null,
  loading: false,
  loadingConfig: false,
};

export default ReportFilters;
