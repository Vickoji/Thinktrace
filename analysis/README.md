# Analyze a coded task extract

`reasoning.ipynb` is a Python 3 notebook using only the standard library inside its cells. The included self-test checks scoring on a deliberately constructed decision. No participant observations are bundled. Open the notebook in Jupyter and run all cells from a fresh kernel. For a real analysis, set `THINKTRACE_CSV` to a reviewed CSV conforming to `docs/research/data-dictionary.md` before starting Jupyter. Run in a private directory and clear outputs before sharing.

For a headless execution with Python 3.12, install the pinned runner in a virtual environment and run from the repository root.

```sh
python3 -m venv /tmp/thinktrace-notebook
/tmp/thinktrace-notebook/bin/pip install -r analysis/requirements.txt
export JUPYTER_CONFIG_DIR=/tmp/thinktrace-notebook/config
export JUPYTER_DATA_DIR=/tmp/thinktrace-notebook/data
export JUPYTER_RUNTIME_DIR=/tmp/thinktrace-notebook/runtime
export IPYTHONDIR=/tmp/thinktrace-notebook/ipython
/tmp/thinktrace-notebook/bin/jupyter nbconvert --execute --to notebook analysis/reasoning.ipynb --output-dir=/tmp
```

The notebook first checks keys, ranges, missing values and phase consistency. It reports participant-level descriptive estimates, complete-form counts and participant-resampled intervals. Intervals describe sampling variability conditional on the observed data. The protocol's adjusted primary analysis and export pipeline belong to later phases.
