using UnityEngine;

public class ValvePumpController
{
    private float _valvePercentage;

    /// <summary>
    /// A value betweeen 0 and 1 indicating the percentage of running generator
    /// </summary>
    public float ValvePercentage
    {
        get { return _valvePercentage; }
        set { _valvePercentage = Mathf.Max(0, Mathf.Min(1, value)); }
    }

    /// <summary>
    /// A value betweeen 0 and 1 indicating the percentage of running generator
    /// </summary>
    /// <remarks>
    /// Its 1-ValuePercentage
    /// </remarks>
    public float PumpPercentage
    {
        get { return 1 - ValvePercentage; }
    }

    /// <summary>
    /// The max valve power the generator of the valve can produce (unit: MwH)
    /// </summary>
    public float ValveMaxPower { get; set; }

    /// <summary>
    /// The max amount of water the valve can pump up (unit: m³)
    /// </summary>
    public float PumpMaxPower { get; set; }

    /// <summary>
    /// The rate how much water is needed to produce energy
    /// </summary>
    /// <see cref="SetupValveRate"/>
    public float ValveRate { get; private set; }

    /// <summary>
    /// The rate how much energy is needed to pump water
    /// </summary>
    /// <see cref="SetupPumpRate"/>
    public float PumpRate { get; private set; }

    public void Start()
    {

    }
    /// <summary>
    /// Sets the rate how much water is needed to procude several amount of energy.
    /// </summary>
    /// <param name="waterAmount">how much water is needed (unit: m³)</param>
    /// <param name="energyAmount">how much energy is produced using the given water (unit:KwH)</param>
    public void SetupValveRate(float waterAmount, float energyAmount)
    {
        // e.g: 3 water needed for 2 energy --> 2/3
        ValveRate = energyAmount / waterAmount;
    }

    /// <summary>
    /// Sets the rate how much energy is needed to pump up an amount of water.
    /// </summary>
    /// <param name="waterAmount">how much water is pumped (unit: m³)</param>
    /// <param name="energyAmount">how much energy is needed to pump the the given water (unit:KwH)</param>
    public void SetupPumpRate(float waterAmount, float energyAmount)
    {
        // e.g: 3 energy needed to pump 2 water --> 2/3
        PumpRate = energyAmount / waterAmount;
    }

    public bool CanOperate(float currentReservoirLevel, float currentDamLevel)
    {
        return CanPump(currentReservoirLevel, currentDamLevel) && CanGenerate(currentReservoirLevel, currentDamLevel);
    }

    public bool CanPump(float currentReservoirLevel, float currentDamLevel)
    {
        float waterGenerationAmount = CalculateCurrentWaterNeed();
        // add the water we will add by generation (short circuit) (if possible)
        if (waterGenerationAmount <= currentDamLevel)
        {
            currentReservoirLevel += waterGenerationAmount;
        }

        float waterPumpAmount = CalculateCurrentWaterPump();

        // we can only pump if our reservoir level is lower-or-equal than the water available in the reservoir
        // (including the water gained by shortcircuit)
        return waterPumpAmount <= currentReservoirLevel;
    }


    public bool CanGenerate(float currentReservoirLevel, float currentDamLevel)
    {
        float waterPumpAmount = CalculateCurrentWaterPump();
        // add the water we will pump up to reservoir  (short circuit) (if possible)
        if (waterPumpAmount <= currentReservoirLevel)
        {
            currentDamLevel += waterPumpAmount;
        }

        float waterGenerationAmount = CalculateCurrentWaterNeed();

        // we can only generate if our needed water amount is lower-or-equal than the water available at the dam
        // (including the water gained by shortcircuit)
        return waterGenerationAmount <= currentDamLevel;
    }

    public float CalculateCurrentWaterPump()
    {
        return CalculateCurrentPowerDemand() / PumpRate;
    }

    public float CalculateCurrentWaterNeed()
    {
        return CalculateCurrentPowerGeneration() / ValveRate;
    }

    public float CalculateCurrentPowerGeneration()
    {
        return ValvePercentage * ValveMaxPower;
    }

    public float CalculateCurrentPowerDemand()
    {
        return PumpPercentage * PumpMaxPower;
    }

    public override string ToString()
    {
        return string.Format("{0:0%} Valve ({1:0.0}MWh) / {2:0%} Pump ({3:0.0}MwH)",
                             ValvePercentage, CalculateCurrentPowerGeneration(),
                             PumpPercentage, CalculateCurrentPowerDemand());
    }
}
