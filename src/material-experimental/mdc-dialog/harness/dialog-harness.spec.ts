import {HarnessLoader} from '@angular/cdk-experimental/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk-experimental/testing/testbed';
import {Component, TemplateRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogHarness} from './dialog-harness';

let fixture: ComponentFixture<DialogHarnessTest>;
let loader: HarnessLoader;
let dialogHarness: typeof MatDialogHarness;

describe('MatDialogHarness', () => {
  describe('non-MDC-based', () => {
    beforeEach(async () => {
      await TestBed
          .configureTestingModule({
            imports: [MatDialogModule, NoopAnimationsModule],
            declarations: [DialogHarnessTest],
          })
          .compileComponents();

      fixture = TestBed.createComponent(DialogHarnessTest);
      fixture.detectChanges();
      loader = new TestbedHarnessEnvironment(document.body, fixture);
      dialogHarness = MatDialogHarness;
    });

    runTests();
  });

  describe(
      'MDC-based',
      () => {
          // TODO: run tests for MDC based radio-button once implemented.
      });
});

/** Shared tests to run on both the original and MDC-based radio-button's. */
function runTests() {
  it('should load harness for dialog', async () => {
    fixture.componentInstance.open();
    const dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(dialogs.length).toBe(1);
  });

  it('should load harness for dialog with specific id', async () => {
    fixture.componentInstance.open({id: 'my-dialog'});
    fixture.componentInstance.open({id: 'other'});
    let dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(dialogs.length).toBe(2);

    dialogs = await loader.getAllHarnesses(dialogHarness.with({selector: '#my-dialog'}));
    expect(dialogs.length).toBe(1);
  });

  it('should be able to get id of dialog', async () => {
    fixture.componentInstance.open({id: 'my-dialog'});
    fixture.componentInstance.open({id: 'other'});
    const dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(await dialogs[0].getId()).toBe('my-dialog');
    expect(await dialogs[1].getId()).toBe('other');
  });

  it('should be able to get role of dialog', async () => {
    fixture.componentInstance.open({role: 'alertdialog'});
    fixture.componentInstance.open({role: 'dialog'});
    fixture.componentInstance.open({role: undefined});
    const dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(await dialogs[0].getRole()).toBe('alertdialog');
    expect(await dialogs[1].getRole()).toBe('dialog');
    expect(await dialogs[2].getRole()).toBe(null);
  });

  it('should be able to get aria-label of dialog', async () => {
    fixture.componentInstance.open();
    fixture.componentInstance.open({ariaLabel: 'Confirm purchase.'});
    const dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(await dialogs[0].getAriaLabel()).toBe(null);
    expect(await dialogs[1].getAriaLabel()).toBe('Confirm purchase.');
  });

  it('should be able to get aria-labelledby of dialog', async () => {
    fixture.componentInstance.open();
    fixture.componentInstance.open({ariaLabelledBy: 'dialog-label'});
    const dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(await dialogs[0].getAriaLabelledby()).toBe(null);
    expect(await dialogs[1].getAriaLabelledby()).toBe('dialog-label');
  });

  it('should be able to get aria-describedby of dialog', async () => {
    fixture.componentInstance.open();
    fixture.componentInstance.open({ariaDescribedBy: 'dialog-description'});
    const dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(await dialogs[0].getAriaDescribedby()).toBe(null);
    expect(await dialogs[1].getAriaDescribedby()).toBe('dialog-description');
  });

  it('should be able to close dialog', async () => {
    fixture.componentInstance.open({disableClose: true});
    fixture.componentInstance.open();
    let dialogs = await loader.getAllHarnesses(dialogHarness);

    expect(dialogs.length).toBe(2);
    await dialogs[0].close();

    dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(dialogs.length).toBe(1);

    // should be a noop since "disableClose" is set to "true".
    await dialogs[0].close();
    dialogs = await loader.getAllHarnesses(dialogHarness);
    expect(dialogs.length).toBe(1);
  });
}

@Component({
  template: `
    <ng-template>
      Hello from the dialog!
    </ng-template>
  `
})
class DialogHarnessTest {
  @ViewChild(TemplateRef, {static: false}) dialogTmpl: TemplateRef<any>;

  constructor(readonly dialog: MatDialog) {}

  open(config?: MatDialogConfig) {
    return this.dialog.open(this.dialogTmpl, config);
  }
}
