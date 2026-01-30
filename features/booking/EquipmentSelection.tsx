'use client';
import React from 'react';
import { useBooking } from '@/context/BookingContext';

export default function EquipmentSelection() {
    const { state, updateEquipment } = useBooking();

    const renderCard = (type: string, title: string, subtitle: string, icon: string) => {
        const count = state.equipment[type] || 0;
        const isSelected = count > 0;

        return (
            <div key={type} className={`p-4 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden transition-all ${isSelected ? 'bg-white dark:bg-surface-dark border-2 border-primary' : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700'}`}>
                {isSelected && <div className="absolute top-0 right-0 bg-primary w-4 h-4 rounded-bl-lg z-10 transition-all"></div>}
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isSelected ? 'bg-primary/10 text-primary' : 'bg-blue-50 dark:bg-blue-900/20 text-primary'}`}>
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                        <h3 className={`font-bold text-sm ${isSelected ? 'text-primary' : ''} transition-colors`}>{title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                    </div>
                </div>
                <div className="flex items-center bg-background-light dark:bg-background-dark rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => updateEquipment(type, -1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-slate-900 dark:text-white">{count}</span>
                    <button
                        onClick={() => updateEquipment(type, 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <section className="mt-8 px-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">directions_boat</span>
                Equipment
            </h2>
            <div className="flex flex-col gap-3">
                {renderCard("20' Standard", "20' Standard", "33.2 cbm • 25,000 kg", "inventory_2")}
                {renderCard("40' Standard", "40' Standard", "67.7 cbm • 28,000 kg", "inventory_2")}
                {renderCard("40' High Cube", "40' High Cube", "76.4 cbm • 28,500 kg", "grid_view")}
            </div>
        </section>
    );
}
