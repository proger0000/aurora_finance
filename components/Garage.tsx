
import React, { useMemo } from 'react';
import Card from './ui/Card';
import { ICONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';
import { UseDataReturn } from '../hooks/useData';

interface GarageProps {
    data: UseDataReturn;
}

const Garage: React.FC<GarageProps> = ({ data }) => {
    const { t, formatCurrency, theme } = useSettings();
    const { cars, refuelings, serviceRecords } = data;

    // For now, we'll focus on the first car if it exists
    const car = cars[0];

    const { totalCost, costPerKm, avgConsumption, costData, consumptionData } = useMemo(() => {
        if (!car) return { totalCost: 0, costPerKm: 0, avgConsumption: 0, costData: [], consumptionData: [] };

        const carRefuelings = refuelings.filter(r => r.carId === car.id);
        const carServices = serviceRecords.filter(s => s.carId === car.id);

        const totalFuelCost = carRefuelings.reduce((sum, r) => sum + (r.liters * r.pricePerLiter), 0);
        const totalServiceCost = carServices.reduce((sum, s) => sum + s.laborCost + s.partsCost, 0);
        const totalCost = totalFuelCost + totalServiceCost;

        const mileages = [...carRefuelings.map(r => r.mileage), ...carServices.map(s => s.mileage)];
        const totalMileage = mileages.length > 1 ? Math.max(...mileages) - Math.min(...mileages) : 0;
        const costPerKm = totalMileage > 0 ? totalCost / totalMileage : 0;
        
        // This is a placeholder calculation for average consumption. A real one would be more complex.
        const totalLiters = carRefuelings.reduce((sum, r) => sum + r.liters, 0);
        const avgConsumption = totalMileage > 0 ? (totalLiters / totalMileage) * 100 : 0; // e.g. L/100km

        // Data for charts (simplified)
        const costData = [
            { name: 'Aug', Fuel: 58, Service: 0 },
            { name: 'Sep', Fuel: 62, Service: 50 },
            { name: 'Oct', Fuel: 78, Service: 5 },
        ];
        const consumptionData = carRefuelings.map(r => ({ mileage: r.mileage, consumption: (r.liters / 45) * 10 })); // dummy calc

        return { totalCost, costPerKm, avgConsumption, costData, consumptionData };

    }, [car, refuelings, serviceRecords]);

    const tooltipBackgroundColor = theme === 'dark' ? 'rgba(38, 44, 58, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    const tooltipBorderColor = theme === 'dark' ? '#4D5566' : '#D9DDE3';
    const axisStrokeColor = theme === 'dark' ? '#B8BEC9' : '#4D5566';
    const gridStrokeColor = theme === 'dark' ? '#4D5566' : '#D9DDE3';

    if (!car) {
        return (
            <div className="animate-fade-in">
                <h1 className="text-3xl font-bold mb-6">{t('garage.title')}</h1>
                <Card><p>{t('garage.noCar')}</p></Card>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6">{t('garage.title')}</h1>

            <Card className="mb-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <img src={car.photoUrl} alt={`${car.make} ${car.model}`} className="w-full md:w-1/3 h-48 object-cover rounded-lg" />
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">{car.make} {car.model}</h2>
                        <p className="text-aura-gray-600 dark:text-aura-gray-300 mb-4">{car.year}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-aura-gray-500 dark:text-aura-gray-400">{t('garage.totalCost')}</p>
                                <p className="text-lg font-semibold">{formatCurrency(totalCost)}</p>
                            </div>
                            <div>
                                <p className="text-aura-gray-500 dark:text-aura-gray-400">{t('garage.costPerKm')}</p>
                                <p className="text-lg font-semibold">{formatCurrency(costPerKm)}</p>
                            </div>
                             <div>
                                <p className="text-aura-gray-500 dark:text-aura-gray-400">{t('garage.avgConsumption')}</p>
                                <p className="text-lg font-semibold">{avgConsumption.toFixed(1)} L/100km</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h3 className="font-bold mb-4">{t('garage.monthlyCosts')}</h3>
                    <div style={{width: '100%', height: 250}}>
                    <ResponsiveContainer>
                        <BarChart data={costData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                            <XAxis dataKey="name" stroke={axisStrokeColor} />
                            <YAxis stroke={axisStrokeColor} />
                            <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, borderColor: tooltipBorderColor, borderRadius: '0.75rem' }} formatter={(value: number) => formatCurrency(value)}/>
                            <Legend />
                            <Bar dataKey="Fuel" stackId="a" fill="#00B4D8" name={t('garage.fuel')} />
                            <Bar dataKey="Service" stackId="a" fill="#F72585" name={t('garage.service')} />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </Card>
                 <Card>
                    <h3 className="font-bold mb-4">{t('garage.energyConsumption')}</h3>
                    <div style={{width: '100%', height: 250}}>
                    <ResponsiveContainer>
                        <LineChart data={consumptionData}>
                             <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                            <XAxis type="number" dataKey="mileage" stroke={axisStrokeColor} domain={['dataMin', 'dataMax']} />
                            <YAxis stroke={axisStrokeColor} />
                            <Tooltip contentStyle={{ backgroundColor: tooltipBackgroundColor, borderColor: tooltipBorderColor, borderRadius: '0.75rem' }}/>
                            <Legend />
                            <Line type="monotone" dataKey="consumption" name={t('garage.consumption')} stroke="#00F5D4" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                </Card>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold mb-4">{t('garage.refuelingHistory')}</h3>
                    <div className="space-y-3">
                        {refuelings.filter(r => r.carId === car.id).map(r => (
                            <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-aura-gray-200/50 dark:bg-aura-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="text-aura-accent">{ICONS.fuel}</div>
                                    <div>
                                        <p className="font-medium">{new Date(r.date).toLocaleDateString()}</p>
                                        <p className="text-xs text-aura-gray-500 dark:text-aura-gray-400">{r.mileage} km</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                     <p className="font-semibold">{formatCurrency(r.liters * r.pricePerLiter)}</p>
                                     <p className="text-xs text-aura-gray-500 dark:text-aura-gray-400">{r.liters} L @ {formatCurrency(r.pricePerLiter)}/L</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                 <Card>
                    <h3 className="font-bold mb-4">{t('garage.serviceHistory')}</h3>
                     <div className="space-y-3">
                        {serviceRecords.filter(s => s.carId === car.id).map(s => (
                            <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-aura-gray-200/50 dark:bg-aura-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="text-aura-accent">{ICONS.service}</div>
                                    <div>
                                        <p className="font-medium">{s.type}</p>
                                        <p className="text-xs text-aura-gray-500 dark:text-aura-gray-400">{new Date(s.date).toLocaleDateString()} - {s.mileage} km</p>
                                    </div>
                                </div>
                                 <p className="font-semibold">{formatCurrency(s.laborCost + s.partsCost)}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Garage;
