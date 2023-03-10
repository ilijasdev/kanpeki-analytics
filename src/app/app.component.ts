import { Component } from '@angular/core';
import { ethers, Contract, BigNumber, utils } from 'ethers';
import { commify, formatUnits } from 'ethers/lib/utils';

import BorrowManager from './contracts/BorrowManager.json';
import DepositManager from './contracts/DepositManager.json';
import StakingManager from './contracts/StakingManager.json';
import Coordinator from './contracts/Coordinator.json';
import Token from './contracts/Token.json';

// VAULT CONTRACTS
import USDCVault from './contracts/USDCVault.json';
import USDTVault from './contracts/USDTVault.json';
import WETHVault from './contracts/WETHVault.json';
import WFTMVault from './contracts/WFTMVault.json';
import LINKVault from './contracts/LINKVault.json';
import DAIVault from './contracts/DAIVault.json';
import WBTCVault from './contracts/WBTCVault.json';

import { ContractsService } from './contracts.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from './components/dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kanpeki-protocol-angular';
  borrowData: any = [];
  kaeTokenAddress: string = '0x65Def5029A0e7591e46B38742bFEdd1Fb7b24436';
  provider = ethers.getDefaultProvider('https://rpc.ftm.tools/');
  kaeStaked: any;
  kaeSupplyStaked: any;

  tokenAddresses: { [key: string]: string; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': '/assets/wETH_32.png',
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': '/assets/wFtm_32.png',
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': '/assets/Dai_32.png',
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': '/assets/USDC_32.png',
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': '/assets/tether_32.png',
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': '/assets/chainlink_32.png',
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': '/assets/wBTC_32.png'
  };

  borrowedAmounts: { [key: string]: string; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': '',
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': '',
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': '',
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': '',
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': '',
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': '',
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': ''
  };

  borrowedAmountPerAsset: { [key: string]: any; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': null,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': null,
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': null,
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': null,
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': null,
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': null,
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': null
  };

  depositedAmounts: { [key: string]: string; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': '',
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': '',
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': '',
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': '',
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': '',
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': '',
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': ''
  };

  depositedAmountPerAsset: { [key: string]: any; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': null,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': null,
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': null,
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': null,
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': null,
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': null,
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': null
  };

  borrowedAmountPerAssetUtilisationCalc: { [key: string]: any; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': null,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': null,
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': null,
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': null,
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': null,
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': null,
  };

  cumulativeAssetsDeposited: { [key: string]: any; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': null,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': null,
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': null,
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': null,
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': null,
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': null,
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': null
  };

  collateralAmounts: { [key: string]: string; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': '',
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': '',
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': '',
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': '',
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': '',
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': '',
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': ''
  };

  collateralAmountPerAsset: { [key: string]: any; } =  {
    '0x74b23882a30290451A17c44f4F05243b6b58C76d': null,
    '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83': null,
    '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E': null,
    '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75': null,
    '0x049d68029688eAbF473097a2fC38ef61633A3C7A': null,
    '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8': null,
    '0x321162Cd933E2Be498Cd2267a90534A804051b11': null
  };

  cumulativeBorrowAmount!: string;
  cumulativeCollateralAmount!: string;
  cumulativeLiquidityAmount!: string;
  depositedAmountSumLoaded: boolean = false;
  borrowedAmountSumLoaded: boolean = false;

  assetPrices: any = {};

  sumaActiveLoansStop: any;
  sumaActiveLoans = 0;

  sumaActiveRepaidStop: any;
  sumaActiveRepaid = 0;

  sumaActiveDefaultedStop: any;
  sumaActiveDefaulted = 0;

  loansCalculationCompleted: boolean = false;

  allBorrowersAddresses: any = []

  constructor(private _cgPrices: ContractsService, public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '550px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.getPrices();
    this.getStakedAmount();
    this.getBorrowContractData();
    this.getBorrowedSum();
    this.getDepositedSum();
    this.depositedSum();
  }

  getPrices() {
    this._cgPrices.getAllWhitelistedPrices()
      .then((res: any) => {
        let key, keys = Object.keys(res);
        let n = keys.length;
        while (n--) {
          key = keys[n];
          this.assetPrices[key.toUpperCase()] = res[key];
        }
      })
  }

  async getBorrowContractData() {
    // OLD BorrowManager CONTRACT
    // const borrowManager = new Contract(
    //   "0x80804723B580CF841af9DA879b41211488D95989",
    //   BorrowManager.abi,
    //   this.provider
    // );

    const borrowManager = new Contract(
      "0x72e2a70654620b36d49a412F4E0f0Cd9C5c3F2DD",
      BorrowManager.abi,
      this.provider
    );

    console.log(borrowManager)
    let debtIDs = await borrowManager.getDebtIDs();
    // console.log(debtIDs)

    let activeLoan = 0;
    let repaidLoan = 0;
    let defaultedLoan = 0;
    let usdcAmountToBeRepaid = 0;

    for (let index = debtIDs.length - 1; index >= 0; index--) {
      const newData: any = {
        'token': '',
        'amount': '',
        'collateralToken': '',
        'collateral': '',
        'interestRate': '',
        'durationInSecs': '',
        'status': ''
      }

      const debt = await borrowManager.getDebtInfo(debtIDs[index]);
      // const loanStartDate = parseInt(debt.startTimestamp.toString());
      // let loanStartDateReadable = new Date(loanStartDate * 1000);
      // console.log(loanStartDateReadable)

      // if(debt.status == 0) {
      //   const isUndercollateralized = await borrowManager.isUndercollateralized(debtIDs[index])
      //   // console.log(isUndercollateralized)
      //   if(isUndercollateralized) {
      //     console.log(debtIDs[index])
      //     console.log(debt)
      //   }
      // };

      if (!this.allBorrowersAddresses.includes(debt.borrower)) this.allBorrowersAddresses.push(debt.borrower);

      newData.borrower = debt.borrower.substring(0,4) + "..." + debt.borrower.substr(debt.borrower.length - 4);
      newData.token = debt.token;
      newData.ftmScan = "https://ftmscan.com/address/" + debt.borrower;
      newData.status = debt.status;
      newData.collateralToken = debt.collateralToken;
      newData.interestRate = formatUnits(debt.interestRate, 2);
      newData.durationInSecs = this.secondsToDhms(debt.durationInSecs);

      if(debt.collateralToken == '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75' || '0x049d68029688eAbF473097a2fC38ef61633A3C7A') {
        newData.collateral = BigNumber.from(debt.collateral._hex);
        newData.collateral = formatUnits(newData.collateral, 18);
      } else {
        newData.collateral = BigNumber.from(debt.collateral._hex);
        newData.collateral = formatUnits(newData.collateral, 6);
      }

      if(debt.token != '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75' || '0x049d68029688eAbF473097a2fC38ef61633A3C7A') {
        newData.amount = BigNumber.from(debt.amount._hex);
        newData.amount = formatUnits(newData.amount, 18);
      }

      if(debt.token == '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75') {
        newData.amount = BigNumber.from(debt.amount._hex);
        newData.amount = formatUnits(newData.amount, 6);

        // console.log((ethers.utils.parseUnits("5000", 6)).toString())
        // await borrowManager.isUndercollateralized(debtIDs[index])
        // parseInt(newData.amount) == 100000
        if(newData.status == 0 && await borrowManager.isUndercollateralized(debtIDs[index])) {
          const loanStartDate = parseInt(debt.startTimestamp.toString());
          const loanDurationDate = parseInt(debt.durationInSecs.toString());
          // const loanExtension = parseInt(debt.extensionTimestamp.toString());
          // console.log(loanExtension)
          let loanExpirationDate = new Date((loanStartDate + loanDurationDate) * 1000);

          usdcAmountToBeRepaid = usdcAmountToBeRepaid+parseInt(newData.amount)*(parseInt(newData.interestRate)/100);

          console.log('%c ' + "USDC", 'border-top: 1px solid #062817')
          console.log(debtIDs[index])
          console.log("Loan Expiration Date: " + loanExpirationDate)
          console.log("Extension Date: " + BigNumber.from(debt.extensionTimestamp._hex))
          console.log("Amount: " + '%c ' + parseInt(newData.amount), 'color: green')
          console.log("Rate amount: " + '%c ' + parseInt(newData.amount)*(parseInt(newData.interestRate)/100), 'color: green')
          // console.log("Amount to be repaid (cumulative): " + usdcAmountToBeRepaid)
        }
      }

      if(debt.token == '0x049d68029688eAbF473097a2fC38ef61633A3C7A') {
        newData.amount = BigNumber.from(debt.amount._hex);
        newData.amount = formatUnits(newData.amount, 6);
      }

      // if(debt.token == '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83' && newData.status == 0) {
      //   console.log("FTM")
      //   const loanStartDate = parseInt(debt.startTimestamp.toString());
      //   const loanDurationDate = parseInt(debt.durationInSecs.toString());
      //   let loanExpirationDate = new Date((loanStartDate + loanDurationDate) * 1000);
      //
      //   console.log(loanExpirationDate)
      //   console.log(newData.amount)
      //   console.log(newData.interestRate + ' %')
      // }

      if(debt.status == 0) activeLoan++
      if(debt.status == 1) repaidLoan++
      if(debt.status == 2) defaultedLoan++

      this.borrowData.push(newData);
    }

    this.incrementSumaActiveLoans(activeLoan);
    this.incrementSumaRepaidLoans(repaidLoan);
    this.incrementSumaDefaultedLoans(defaultedLoan);
    this.loansCalculationCompleted = true;
    this.collaterSum()
  }

  async getStakedAmount() {
    const stakingManager = new Contract(
      this.kaeTokenAddress,
      Token.abi,
      this.provider
    );

    const balance = await stakingManager.balanceOf('0xc6F31e7AAD8ea139dA1ec754626781235283d70D');

    // console.log(balance)
    // console.log(balance.toString());
    // console.log(formatUnits(balance, 18));
    this.kaeStaked = parseInt(formatUnits(balance, 18)).toFixed(2);
    this.kaeSupplyStaked = (((parseInt(this.kaeStaked))/294695)*100).toFixed(2);
  }

  async getBorrowedSum() {
    const borrowSumContract = new Contract(
      "0xD612a8205EbD0fAc64476ccA47AD4316e5239d20",
      Coordinator.abi,
      this.provider
    );
    let cumulativeSum = 0;

    for (let asset of Object.keys(this.tokenAddresses)) {
      let assetInfo = await borrowSumContract.getAsset(asset);

      if (asset == '0x321162Cd933E2Be498Cd2267a90534A804051b11') {
        const totalBorrowedForCalc = parseInt(formatUnits(assetInfo.totalBorrowed, 8));
        const assetAddressForPrice = asset.toUpperCase();
        // CUMULATIVE INTEREST PAID console.log(parseInt(formatUnits(assetInfo.cumulativeInterestPaid, 6))*this.assetPrices[assetAddressForPrice]?.usd)

        this.borrowedAmounts[asset] = commify(formatUnits(assetInfo.totalBorrowed, 6));

        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
        this.borrowedAmountPerAssetUtilisationCalc[asset] = this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc;
        this.borrowedAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);

        this.cumulativeAssetsDeposited[asset] = this.cumulativeAssetsDeposited[asset] + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
      }

      if (asset == '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75') {
        const totalBorrowedForCalc = parseInt(formatUnits(assetInfo.totalBorrowed, 6));
        const assetAddressForPrice = asset.toUpperCase();
        // CUMULATIVE INTEREST PAID console.log(parseInt(formatUnits(assetInfo.cumulativeInterestPaid, 6))*this.assetPrices[assetAddressForPrice]?.usd)

        this.borrowedAmounts[asset] = commify(formatUnits(assetInfo.totalBorrowed, 6));

        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
        this.borrowedAmountPerAssetUtilisationCalc[asset] = this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc;
        this.borrowedAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);

        this.cumulativeAssetsDeposited[asset] = this.cumulativeAssetsDeposited[asset] + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
      }

      if (asset == '0x049d68029688eAbF473097a2fC38ef61633A3C7A') {
        const totalBorrowedForCalc = parseInt(formatUnits(assetInfo.totalBorrowed, 6));
        const assetAddressForPrice = asset.toUpperCase();
        // CUMULATIVE INTEREST PAID console.log(parseInt(formatUnits(assetInfo.cumulativeInterestPaid, 6))*this.assetPrices[assetAddressForPrice]?.usd)

        this.borrowedAmounts[asset] = commify(formatUnits(assetInfo.totalBorrowed, 6));

        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
        this.borrowedAmountPerAssetUtilisationCalc[asset] = this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc;
        this.borrowedAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);

        this.cumulativeAssetsDeposited[asset] = this.cumulativeAssetsDeposited[asset] + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
      }

      if (asset == '0x74b23882a30290451A17c44f4F05243b6b58C76d') {
        const totalBorrowedForCalc = parseInt(formatUnits(assetInfo.totalBorrowed, 18));
        const assetAddressForPrice = asset.toUpperCase();
        // CUMULATIVE INTEREST PAID console.log(parseInt(formatUnits(assetInfo.cumulativeInterestPaid, 18))*this.assetPrices[assetAddressForPrice]?.usd)

        this.borrowedAmounts[asset] = commify(formatUnits(assetInfo.totalBorrowed, 18));

        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
        this.borrowedAmountPerAssetUtilisationCalc[asset] = this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc;
        this.borrowedAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);

        this.cumulativeAssetsDeposited[asset] = this.cumulativeAssetsDeposited[asset] + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
      }

      if (asset == '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83') {
        const totalBorrowedForCalc = parseInt(formatUnits(assetInfo.totalBorrowed, 18));
        const assetAddressForPrice = asset.toUpperCase();
        // CUMULATIVE INTEREST PAID console.log(parseInt(formatUnits(assetInfo.cumulativeInterestPaid, 18))*this.assetPrices[assetAddressForPrice]?.usd)

        this.borrowedAmounts[asset] = commify(formatUnits(assetInfo.totalBorrowed, 18));

        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
        this.borrowedAmountPerAssetUtilisationCalc[asset] = this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc;
        this.borrowedAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);

        this.cumulativeAssetsDeposited[asset] = this.cumulativeAssetsDeposited[asset] + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
      }

      if (asset =='0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E') {
        const totalBorrowedForCalc = parseInt(formatUnits(assetInfo.totalBorrowed, 18));
        const assetAddressForPrice = asset.toUpperCase();
        // CUMULATIVE INTEREST PAID console.log(parseInt(formatUnits(assetInfo.cumulativeInterestPaid, 18))*this.assetPrices[assetAddressForPrice]?.usd)

        this.borrowedAmounts[asset] = commify(formatUnits(assetInfo.totalBorrowed, 18));

        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
        this.borrowedAmountPerAssetUtilisationCalc[asset] = this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc;
        this.borrowedAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);

        this.cumulativeAssetsDeposited[asset] = this.cumulativeAssetsDeposited[asset] + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
      }

      if (asset == '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8') {
        const totalBorrowedForCalc = parseInt(formatUnits(assetInfo.totalBorrowed, 18));
        const assetAddressForPrice = asset.toUpperCase();
        // CUMULATIVE INTEREST PAID console.log(parseInt(formatUnits(assetInfo.cumulativeInterestPaid, 18))*this.assetPrices[assetAddressForPrice]?.usd)

        this.borrowedAmounts[asset] = commify(formatUnits(assetInfo.totalBorrowed, 18));

        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
        this.borrowedAmountPerAssetUtilisationCalc[asset] = this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc;
        this.borrowedAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);

        this.cumulativeAssetsDeposited[asset] = this.cumulativeAssetsDeposited[asset] + (this.assetPrices[assetAddressForPrice]?.usd*totalBorrowedForCalc);
      }
    }

    this.cumulativeBorrowAmount = this.formatAsCurrency(cumulativeSum)
    this.borrowedAmountSumLoaded = true;
  }

  async getDepositedSum() {
    const usdcVaultContract = new Contract(
      "0x99E45eBFCD3a9bC22cFc9E5E0B91942c3d5Fe7BA",
      USDCVault.abi,
      this.provider
    );
    const usdtVaultContract = new Contract(
      "0xA552935f4cfA82010f501385CDe2054f0FB44d8A",
      USDTVault.abi,
      this.provider
    );
    const wethVaultContract = new Contract(
      "0xFe745455ca5eC4e6399B3A6242a2584d462fDc13",
      WETHVault.abi,
      this.provider
    );
    const wftmVaultContract = new Contract(
      "0xF8F856223fC6A159B7F2c7887d68ECf1B63B3ACb",
      WFTMVault.abi,
      this.provider
    );
    const linkVaultContract = new Contract(
      "0x4da524EB70A8c601213C74BA5a71bFDCA8596B0F",
      LINKVault.abi,
      this.provider
    );
    const daiVaultContract = new Contract(
      "0x55c10853Ca03D58180F66f38BD696328209A326A",
      DAIVault.abi,
      this.provider
    );
    const wbtcVaultContract = new Contract(
      "0xaD0E4C6DC54eDbED8f3b6840DDeAc01748d2D69c",
      WBTCVault.abi,
      this.provider
    );

    let usdcVaultAvailableAmount;
    let usdtVaultAvailableAmount;
    let wethVaultAvailableAmount;
    let wftmVaultAvailableAmount;
    let linkVaultAvailableAmount;
    let daiVaultAvailableAmount;
    let wbtcVaultAvailableAmount;

    // DEPOSIT AVAILABLE
    usdcVaultAvailableAmount = await usdcVaultContract.getBalance();
    usdtVaultAvailableAmount = await usdtVaultContract.getBalance();
    wethVaultAvailableAmount = await wethVaultContract.getBalance();
    wftmVaultAvailableAmount = await wftmVaultContract.getBalance();
    linkVaultAvailableAmount = await linkVaultContract.getBalance();
    daiVaultAvailableAmount = await daiVaultContract.getBalance();
    wbtcVaultAvailableAmount = await wbtcVaultContract.getBalance();

    let cumulativeSum = 0;

    for(let vault of Object.keys(this.depositedAmounts)) {
      if (vault == '0x321162Cd933E2Be498Cd2267a90534A804051b11') {
        const totalDepositedForCalc = parseInt(formatUnits(wbtcVaultAvailableAmount, 8));
        const assetAddressForPrice = vault.toUpperCase();
        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
        this.depositedAmounts[vault] = parseFloat(formatUnits(wbtcVaultAvailableAmount, 8)).toFixed(2)
        this.depositedAmountPerAsset[vault] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);

        this.cumulativeAssetsDeposited[vault] = this.cumulativeAssetsDeposited[vault] + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
      }

      if (vault == '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75') {
        const totalDepositedForCalc = parseInt(formatUnits(usdcVaultAvailableAmount, 6));
        const assetAddressForPrice = vault.toUpperCase();
        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
        this.depositedAmounts[vault] = parseFloat(formatUnits(usdcVaultAvailableAmount, 6)).toFixed(2)
        this.depositedAmountPerAsset[vault] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);

        this.cumulativeAssetsDeposited[vault] = this.cumulativeAssetsDeposited[vault] + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
      }

      if (vault == '0x049d68029688eAbF473097a2fC38ef61633A3C7A') {
        const totalDepositedForCalc = parseInt(formatUnits(usdtVaultAvailableAmount, 6));
        const assetAddressForPrice = vault.toUpperCase();
        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
        this.depositedAmounts[vault] = parseFloat(formatUnits(usdtVaultAvailableAmount, 6)).toFixed(2)
        this.depositedAmountPerAsset[vault] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);

        this.cumulativeAssetsDeposited[vault] = this.cumulativeAssetsDeposited[vault] + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
      }

      if (vault == '0x74b23882a30290451A17c44f4F05243b6b58C76d') {
        const totalDepositedForCalc = parseInt(formatUnits(wethVaultAvailableAmount, 18));
        const assetAddressForPrice = vault.toUpperCase();
        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
        this.depositedAmounts[vault] = parseFloat(formatUnits(wethVaultAvailableAmount, 18)).toFixed(2)
        this.depositedAmountPerAsset[vault] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);

        this.cumulativeAssetsDeposited[vault] = this.cumulativeAssetsDeposited[vault] + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
      }

      if (vault == '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83') {
        const totalDepositedForCalc = parseInt(formatUnits(wftmVaultAvailableAmount, 18));
        const assetAddressForPrice = vault.toUpperCase();
        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
        this.depositedAmounts[vault] = parseFloat(formatUnits(wftmVaultAvailableAmount, 18)).toFixed(2)
        this.depositedAmountPerAsset[vault] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);

        this.cumulativeAssetsDeposited[vault] = this.cumulativeAssetsDeposited[vault] + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
      }

      if (vault =='0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E') {
        const totalDepositedForCalc = parseInt(formatUnits(daiVaultAvailableAmount, 18));
        const assetAddressForPrice = vault.toUpperCase();
        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
        this.depositedAmounts[vault] = parseFloat(formatUnits(daiVaultAvailableAmount, 18)).toFixed(2)
        this.depositedAmountPerAsset[vault] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);

        this.cumulativeAssetsDeposited[vault] = this.cumulativeAssetsDeposited[vault] + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
      }

      if (vault == '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8') {
        const totalDepositedForCalc = parseInt(formatUnits(linkVaultAvailableAmount, 18));
        const assetAddressForPrice = vault.toUpperCase();
        cumulativeSum = cumulativeSum + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
        this.depositedAmounts[vault] = parseFloat(formatUnits(linkVaultAvailableAmount, 18)).toFixed(2)
        this.depositedAmountPerAsset[vault] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);

        this.cumulativeAssetsDeposited[vault] = this.cumulativeAssetsDeposited[vault] + (this.assetPrices[assetAddressForPrice]?.usd*totalDepositedForCalc);
      }
    }

    // console.log(parseFloat(formatUnits(usdcVaultAvailableAmount, 6)).toFixed(2))
    // console.log(parseFloat(formatUnits(usdtVaultAvailableAmount, 6)).toFixed(2))
    // console.log(parseFloat(formatUnits(wethVaultAvailableAmount, 18)).toFixed(2))
    // console.log(parseFloat(formatUnits(wftmVaultAvailableAmount, 18)).toFixed(2))
    // console.log(parseFloat(formatUnits(linkVaultAvailableAmount, 18)).toFixed(2))
    // console.log(parseFloat(formatUnits(daiVaultAvailableAmount, 18)).toFixed(2))

    this.cumulativeLiquidityAmount = this.formatAsCurrency(cumulativeSum)
    this.depositedAmountSumLoaded = true;
  }

  collaterSum() {
    // 0x04068DA6C83AFCFA0e13ba15A6696662335D5B75
    let cumulativeUSDCcollateral = 0;
    // 0x049d68029688eAbF473097a2fC38ef61633A3C7A
    let cumulativeUSDTcollateral = 0;
    // 0x74b23882a30290451A17c44f4F05243b6b58C76d
    let cumulativeWETHcollateral = 0;
    // 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83
    let cumulativeWFTMcollateral = 0;
    // 0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E
    let cumulativeDAIcollateral = 0;
    // 0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8
    let cumulativeLINKcollateral = 0;

    const borrowDataDeepCopy = JSON.parse(JSON.stringify(this.borrowData))

    for (let asset of Object.keys(this.collateralAmounts)) {
      for (let borrowEntry of borrowDataDeepCopy) {
        if (asset == '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75' && asset == borrowEntry.collateralToken) {
          const collateralUSDCamount = parseInt(borrowEntry.collateral);
          const assetAddressForPrice = asset.toUpperCase();
          cumulativeUSDCcollateral = cumulativeUSDCcollateral+collateralUSDCamount;
          this.collateralAmounts[asset] = cumulativeUSDCcollateral.toString();
          this.collateralAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*cumulativeUSDCcollateral);
        }

        if (asset == '0x049d68029688eAbF473097a2fC38ef61633A3C7A' && asset == borrowEntry.collateralToken) {
          const collateralUSDTamount = parseInt(borrowEntry.collateral);
          const assetAddressForPrice = asset.toUpperCase();
          cumulativeUSDTcollateral = cumulativeUSDTcollateral+collateralUSDTamount;
          this.collateralAmounts[asset] = cumulativeUSDTcollateral.toString();
          this.collateralAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*cumulativeUSDTcollateral);
        }

        if (asset == '0x74b23882a30290451A17c44f4F05243b6b58C76d' && asset == borrowEntry.collateralToken) {
          const collateralWETHamount = parseInt(borrowEntry.collateral);
          const assetAddressForPrice = asset.toUpperCase();
          cumulativeWETHcollateral = cumulativeWETHcollateral+collateralWETHamount;
          this.collateralAmounts[asset] = cumulativeWETHcollateral.toString();
          this.collateralAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*cumulativeWETHcollateral);
        }

        if (asset == '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83' && asset == borrowEntry.collateralToken) {
          const collateralWFTMamount = parseInt(borrowEntry.collateral);
          const assetAddressForPrice = asset.toUpperCase();
          cumulativeWFTMcollateral = cumulativeWFTMcollateral+collateralWFTMamount;
          this.collateralAmounts[asset] = cumulativeWFTMcollateral.toString();
          this.collateralAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*cumulativeWFTMcollateral);
        }

        if (asset =='0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E' && asset == borrowEntry.collateralToken) {
          const collateralDAIamount = parseInt(borrowEntry.collateral);
          const assetAddressForPrice = asset.toUpperCase();
          cumulativeDAIcollateral = cumulativeDAIcollateral+collateralDAIamount;
          this.collateralAmounts[asset] = cumulativeDAIcollateral.toString();
          this.collateralAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*cumulativeDAIcollateral);
        }

        if (asset == '0xb3654dc3D10Ea7645f8319668E8F54d2574FBdC8' && asset == borrowEntry.collateralToken) {
          const collateralLINKamount = parseInt(borrowEntry.collateral);
          const assetAddressForPrice = asset.toUpperCase();
          cumulativeLINKcollateral = cumulativeLINKcollateral+collateralLINKamount;
          this.collateralAmounts[asset] = cumulativeLINKcollateral.toString();
          this.collateralAmountPerAsset[asset] = this.formatAsCurrency(this.assetPrices[assetAddressForPrice]?.usd*cumulativeLINKcollateral);
        }
      }
    }

    cumulativeUSDCcollateral = cumulativeUSDCcollateral*this.assetPrices['0X04068DA6C83AFCFA0E13BA15A6696662335D5B75']?.usd;
    cumulativeUSDTcollateral = cumulativeUSDTcollateral*this.assetPrices['0X049D68029688EABF473097A2FC38EF61633A3C7A']?.usd;
    cumulativeWETHcollateral = cumulativeWETHcollateral*this.assetPrices['0X74B23882A30290451A17C44F4F05243B6B58C76D']?.usd;
    cumulativeWFTMcollateral = cumulativeWFTMcollateral*this.assetPrices['0X21BE370D5312F44CB42CE377BC9B8A0CEF1A4C83']?.usd;
    cumulativeDAIcollateral = cumulativeDAIcollateral*this.assetPrices['0X8D11EC38A3EB5E956B052F67DA8BDC9BEF8ABF3E']?.usd;
    cumulativeLINKcollateral = cumulativeLINKcollateral*this.assetPrices['0XB3654DC3D10EA7645F8319668E8F54D2574FBDC8']?.usd;

    // console.log(this.collateralAmounts)
    // console.log(this.collateralAmountPerAsset)
    // console.log(cumulativeUSDTcollateral)
    // console.log(cumulativeWETHcollateral)
    // console.log(cumulativeWFTMcollateral)
    // console.log(cumulativeDAIcollateral)
    // console.log(cumulativeLINKcollateral)
    // console.log(cumulativeUSDCcollateral)
    const cumulativeCollateral = cumulativeUSDCcollateral+
      cumulativeUSDTcollateral+
      cumulativeWETHcollateral+
      cumulativeWFTMcollateral+
      cumulativeDAIcollateral+
      cumulativeLINKcollateral;
    this.cumulativeCollateralAmount = this.formatAsCurrency(cumulativeCollateral)
  }

  secondsToDhms(seconds: number) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600*24));
    let dDisplay = d > 0 ? d + (d == 1 ? " day" : " days") : "";
    return dDisplay;
  }

  formatAsCurrency(amount: number | bigint) {
    // console.log(amount)
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }

  depositedSum() {
    // console.log(this.borrowedAmountPerAsset)
    // console.log(this.depositedAmountPerAsset)
    // console.log(this.cumulativeAssetsDeposited)
  }

  vaultUtilisationRate(asset: string) {
    // console.log(this.borrowedAmountPerAssetUtilisationCalc[asset]);
    // console.log(this.cumulativeAssetsDeposited[asset]);
    if (this.depositedAmountSumLoaded && this.borrowedAmountSumLoaded)
      return ((((this.borrowedAmountPerAssetUtilisationCalc[asset]/this.cumulativeAssetsDeposited[asset])*100).toFixed(2)).toString()+'%');
    else return '0%';
  }

  incrementSumaActiveLoans(count: number) {
    this.sumaActiveLoansStop = setInterval(() => {
      this.sumaActiveLoans++;
      if (this.sumaActiveLoans > count) {
        this.sumaActiveLoans = count;
        clearInterval(this.sumaActiveLoans);
      }
    }, 100);
  }

  incrementSumaRepaidLoans(count: number) {
    this.sumaActiveRepaidStop = setInterval(() => {
      this.sumaActiveRepaid++;
      if (this.sumaActiveRepaid > count) {
        this.sumaActiveRepaid = count;
        clearInterval(this.sumaActiveRepaid);
      }
    }, 100);
  }

  incrementSumaDefaultedLoans(count: number) {
    this.sumaActiveDefaultedStop = setInterval(() => {
      this.sumaActiveDefaulted++;
      if (this.sumaActiveDefaulted > count) {
        this.sumaActiveDefaulted = count;
        clearInterval(this.sumaActiveDefaulted);
      }
    }, 100);
  }
}
